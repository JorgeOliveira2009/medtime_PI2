# Guia — Escanear receita/bula e gerar alarmes no MedTime

Este guia não traz código pronto. Ele explica **o que construir, por quê,
quais conceitos estudar e quais armadilhas evitar**. A implementação —
escrever os arquivos, testar no celular, debugar — é com vocês.

Se travarem em algum ponto específico, tragam o erro exato (mensagem +
onde aconteceu) pra discutirmos, mas não peçam pro chat "faz esse arquivo pra
mim" — o objetivo aqui é vocês entenderem cada peça o suficiente pra
defender o projeto.

---

## 1. O que vocês já têm (não mexer na essência)

Antes de escrever qualquer linha, releiam o próprio projeto:

- `AuthContext` — quem é o usuário logado, token, login/logout.
- `RemediosContext` — a lista de remédios do usuário, com
  `adicionarRemedio`, `toggleRemedio`, `removerRemedio`, salvos via
  `AsyncStorage`.
- `PaginaPrincipal` — calendário + lista de remédios + modal manual de
  adicionar remédio.
- Um backend próprio (Node/Express/TypeORM/MySQL) que hoje só cuida de
  **usuário** (cadastro/login/perfil) — não tem nada de remédio nele.

A nova funcionalidade (**escanear receita/bula → gerar remédios com
alarme automaticamente**) deve **se encaixar no que já existe**, não
substituir. Ou seja: no final, um remédio criado por scan e um remédio
criado manualmente devem aparecer exatamente na mesma lista, com a
mesma aparência, e funcionar com os mesmos botões de tomar/excluir.

**Regra de ouro da integração:** todo campo novo que vocês precisarem
guardar num remédio (dosagem, data completa, id do alarme, etc.) deve
ser **opcional** no tipo `Remedio`. Assim, remédios antigos (sem esses
campos) continuam funcionando sem quebrar nada, e vocês não precisam
tocar no código que já lê `remedios` em outros lugares do app.

---

## 2. Visão geral do fluxo a construir

```
Usuário toca em "Escanear receita"
        │
        ▼
   Abre a câmera (expo-camera)
        │
        ▼
   Usuário fotografa a receita/bula
        │
        ▼
   Foto é enviada para um serviço de OCR
   (extrai o texto da imagem)
        │
        ▼
   Texto é interpretado (parser) para tentar achar:
   medicamento, dosagem, intervalo entre doses, duração do tratamento
        │
        ▼
   Tela de confirmação — usuário CORRIGE o que o OCR/parser errou
   (isso é obrigatório, não é só um "extra bonito")
        │
        ▼
   A partir do intervalo + duração, calcula-se a lista de horários
   de cada dose (ex.: de 8/8h por 7 dias = 21 doses)
        │
        ▼
   Cada dose vira um item na lista de remédios já existente
   (reaproveitando adicionarRemedio / RemediosContext)
        │
        ▼
   Para cada dose, agenda-se um alarme local (expo-notifications)
```

Cada uma dessas caixas é uma peça que dá pra estudar e implementar
separadamente, testando isoladamente antes de juntar tudo.

---

## 3. Peça 1 — Câmera

**Estudar:** `expo-camera` — especificamente o componente `CameraView`
e o hook de permissão (`useCameraPermissions`).

**Pontos que vocês precisam resolver sozinhos:**
- Como pedir permissão de câmera e o que mostrar enquanto ela não foi
  concedida (tela em branco não é aceitável).
- Como capturar uma foto e obter o caminho (`uri`) do arquivo gerado.
- O que configurar no `app.json` para a permissão de câmera funcionar
  tanto no Expo Go quanto num build futuro (procurem por "config
  plugins" do `expo-camera").

**Teste que precisa passar:** negar a permissão e verificar que o app
não trava, apenas explica o que fazer e permite tentar de novo.

---

## 4. Peça 2 — OCR (ler o texto da foto)

Aqui está a decisão mais importante de arquitetura, então parem pra
pensar antes de escrever código.

### 4.1 A pergunta que vocês precisam responder

**Onde o texto da imagem deve ser lido: no celular, ou num backend que
vocês mesmos hospedam?**

Pensem nos dois caminhos:

- **Backend próprio fazendo OCR:** exige que o servidor esteja
  rodando, que o celular saiba o IP certo dele (o próprio projeto de
  vocês já tem esse problema — deem uma olhada em como o login busca
  `API_URL` no arquivo de login do app: é um IP fixo, escrito na mão,
  que muda toda vez que troca de rede). Multiplicando esse problema
  pelo OCR, cada colega que for testar o projeto de vocês precisa
  configurar isso de novo.
- **Serviço de OCR gratuito, chamado direto do celular via HTTP:** sem
  servidor pra manter no ar, sem IP pra configurar. O trade-off é
  depender de internet e de um serviço de terceiros com limite de uso
  gratuito.

**Não estamos dizendo qual escolher.** Mas expliquem, na documentação
final do projeto, por que escolheram o caminho que escolheram — essa é
uma decisão de arquitetura de verdade, com prós e contras reais, e é
exatamente o tipo de coisa que se pergunta numa banca.

Se optarem por um serviço de OCR gratuito chamado direto do celular,
pesquisem por **OCR.space** (tem API REST gratuita, sem cartão de
crédito, com um plano free de 25.000 requisições/mês). Não é a única
opção — pesquisem alternativas também — mas é uma que atende ao
requisito de "gratuito para os alunos usarem".

### 4.2 O que estudar tecnicamente

- Como montar uma requisição `multipart/form-data` a partir de uma
  `uri` de foto do `expo-camera`, usando `FormData` no React Native
  (não é igual a mandar um arquivo do navegador — pesquisem
  especificamente "FormData file upload React Native fetch").
- Como configurar o idioma do OCR para português (procurem os
  parâmetros de idioma da API que escolherem).
- Como tratar timeout de rede em `fetch` — **atenção**: nem toda API
  de JavaScript que existe no navegador (ou no Node) existe também no
  motor que roda o React Native (Hermes). Antes de usar qualquer
  método de `AbortSignal`, testem no celular de verdade, não só
  confiem que "compilou, então funciona" — várias dessas APIs mais
  novas simplesmente não existem no Hermes e falham silenciosamente
  como se fosse erro de rede, o que engana bastante na hora de
  debugar. Se o app disser "não foi possível conectar" mesmo com
  internet boa, esse é um dos primeiros lugares a suspeitar.

**Teste que precisa passar:** tirar uma foto borrada ou sem nenhum
texto de remédio e o app não pode travar — precisa mostrar um erro
compreensível.

---

## 5. Peça 3 — Interpretar o texto (parser)

O OCR devolve texto solto, tipo:

```
Amoxicilina 500 mg
Tomar 1 cápsula de 8 em 8 horas
durante 7 dias
```

Vocês precisam extrair dessa bagunça:
- nome do medicamento
- dosagem (quantidade + unidade: mg, ml, etc.)
- quantidade por dose (1 comprimido, 2 gotas...)
- intervalo entre doses, em horas
- duração do tratamento, em dias

### 5.1 O que estudar

- **Expressões regulares (regex) em JavaScript/TypeScript** — é a
  ferramenta certa pra esse problema, dado que é texto em português
  seguindo padrões relativamente previsíveis. Não é preciso (nem é o
  objetivo da disciplina) usar IA/LLM aqui.
- Pensem nos formatos que o texto pode assumir, porque não é só um:
  - intervalo: "de 8 em 8 horas", "a cada 6 horas", "3 vezes ao dia",
    "8/8h"
  - duração: "durante 7 dias", "por 2 semanas", "por 1 mês"
  - números por extenso: "uma vez ao dia", "dois comprimidos"

### 5.2 Sejam honestos sobre os limites

Um parser baseado em regras **não vai acertar sempre**, e não tem
problema nenhum nisso — é esperado. Bulas de verdade trazem frases
como "se necessário", "não exceder X por dia", que não têm um
horário fixo pra extrair. É exatamente por isso que a próxima etapa
(confirmação manual) é obrigatória, não opcional.

**Teste que precisa passar:** joguem pelo menos 5 textos diferentes
no parser (peçam pra IA de vocês, ou peguem bulas reais na internet)
e documentem quais campos ele acerta e quais erra. Isso vira material
bom pra apresentação/defesa do PI.

---

## 6. Peça 4 — Gerar a lista de doses

A partir de "início do tratamento" + "intervalo em horas" + "duração
em dias", vocês precisam calcular todos os horários de dose.

**O que estudar:** manipulação de datas em JavaScript (`Date`,
milissegundos, `getTime()`). É basicamente um laço que soma o
intervalo repetidamente até passar da data final.

**Cuidado com:**
- Limitar um número máximo de doses geradas (alguém pode digitar um
  intervalo de 1 hora por 365 dias sem querer — isso são milhares de
  notificações).
- Validar que intervalo e duração são números positivos antes de
  gerar qualquer coisa.

---

## 7. Peça 5 — Encaixar no RemediosContext

Esse é o ponto onde a integração de verdade acontece.

**Perguntas para vocês responderem enquanto implementam:**

1. O tipo `Remedio` de vocês hoje é `{ id, nome, horario, tomado }`.
   Quais campos novos (opcionais!) ele precisa ganhar pra guardar uma
   dose gerada por scan sem quebrar remédios adicionados manualmente?
2. Adicionar 21 doses de uma vez (uma receita de 7 dias, de 8/8h) uma
   por uma, chamando a função de adicionar remédio existente em loop,
   tem algum problema? (pensem em como o `id` de cada remédio é
   gerado hoje, e o que acontece se dois remédios forem criados no
   mesmo instante.)
3. Depois de agendar os alarmes (peça 6), vocês vão ter, pra cada
   dose, um "id do alarme". Onde esse id fica guardado, e por quê?
   (dica: pensem no que precisa acontecer quando alguém *exclui* um
   remédio da lista — o alarme correspondente deveria continuar
   tocando?)

**Debug obrigatório antes de considerar essa peça pronta:** façam
login com duas contas diferentes no mesmo celular (ou dois celulares)
e confiram se os remédios de uma conta aparecem pra outra. Se
aparecerem, tem um bug na forma como a chave de armazenamento por
usuário está sendo montada dentro do `RemediosContext` — comparem com
atenção o nome do campo que vocês leem do `AuthContext` (`useAuth()`)
com o nome real que o `AuthContext` exporta. Esse é um bug clássico de
digitação entre dois arquivos que "parecem" bater mas não batem, e o
TypeScript não vai necessariamente acusar dependendo de como foi
escrito — só testando mesmo.

---

## 8. Peça 6 — Alarmes (notificações locais)

**Estudar:** `expo-notifications` — especificamente notificações
**locais agendadas** (não é push notification vinda de servidor, é o
próprio celular disparando no horário certo).

**Pontos a resolver:**
- Pedir permissão de notificação (parecido com câmera).
- No Android, notificações precisam de um "canal" configurado antes
  de poderem ser agendadas — pesquisem "notification channel Android
  Expo".
- Como agendar uma notificação pra uma data/hora específica (existe
  mais de um jeito de configurar o "trigger" de uma notificação —
  leiam a documentação da versão do `expo-notifications` que vocês
  instalarem, porque essa API já mudou de formato entre versões).
- Como cancelar uma notificação já agendada (vocês vão precisar disso
  se decidirem que excluir um remédio deve cancelar o alarme dele —
  ver pergunta 3 da seção anterior).

**Teste que precisa passar:** agendar uma dose pra 1-2 minutos no
futuro e confirmar que a notificação realmente aparece com o app
fechado (não só com o app aberto — são comportamentos diferentes).

---

## 9. Erros comuns — testem especificamente isso

Antes de considerar a funcionalidade pronta, testem cada um destes
cenários de propósito:

- [ ] Negar a permissão de câmera — o app não pode travar.
- [ ] Negar a permissão de notificação — os remédios ainda devem ser
      criados, só sem alarme (e o app deve avisar disso, não falhar
      silenciosamente).
- [ ] Tirar foto sem internet — mensagem de erro clara, sem travar.
- [ ] Foto de um texto que não tem nada a ver com remédio — o parser
      não deve inventar dados, deve deixar os campos em branco pra
      correção manual.
- [ ] Confirmar o formulário com o campo "medicamento" vazio — deve
      bloquear e avisar, não criar um remédio sem nome.
- [ ] Duas contas diferentes no mesmo aparelho — remédios não podem
      vazar de uma conta pra outra.
- [ ] Fechar o app depois de agendar um alarme — o alarme precisa
      disparar mesmo assim.

---

## 10. Coisas para estudar, resumidas (com o que pesquisar)

| Peça | Pesquisar |
|---|---|
| Câmera | `expo-camera`, `CameraView`, `useCameraPermissions` |
| OCR | API REST de OCR gratuita (ex. OCR.space), `FormData` file upload em React Native, `fetch` |
| Parser | Expressões regulares em JavaScript/TypeScript |
| Datas | `Date` em JavaScript, cálculo de intervalos em milissegundos |
| Alarmes | `expo-notifications`, notification channels Android, scheduled notifications, cancelamento de notificação |
| Armazenamento | `AsyncStorage` (vocês já usam — revisem como funciona) |
| Arquitetura | Trade-offs de fazer OCR no cliente vs. num backend próprio |

---

## 11. O que documentar no relatório final

Pra além do código funcionando, documentem (isso conta ponto e ajuda
na defesa):

1. Por que optaram por fazer (ou não) o OCR direto no celular, em vez
   de passar por um backend próprio.
2. As limitações reais do parser — mostrem exemplos de texto que ele
   acerta e que erra.
3. O bug do `RemediosContext` (se encontrarem e corrigirem) — o que
   era, como descobriram, como corrigiram. Bugs reais encontrados e
   corrigidos são ótimo material de relatório.
4. Quais permissões o app pede e por quê.

Bom trabalho — chamem quando travarem em algo pontual e específico.
