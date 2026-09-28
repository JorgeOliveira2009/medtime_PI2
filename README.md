

<div align="center">
  <img width="350" height="344" alt="image" src="https://github.com/user-attachments/assets/51e66e5b-bb06-46f6-b37b-71b42c049d33" />


  <h1>MedTime</h1>
  <p><strong>Seus remédios. No horário certo.</strong></p>

  <p>
    <img alt="React Native" src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB"/>
    <img alt="Expo" src="https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white"/>
    <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white"/>
    <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white"/>
    <img alt="MySQL" src="https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white"/>
    <img alt="Railway" src="https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=railway&logoColor=white"/>
  </p>
</div>

---

## Sobre o projeto

O MedTime é um aplicativo móvel desenvolvido para auxiliar pessoas no controle e adesão ao tratamento medicamentoso. Esquecer de tomar um remédio ou confundir horários é um problema comum — especialmente para quem toma múltiplos medicamentos. O MedTime resolve isso com lembretes, organização e um diferencial: **leitura automática de receitas médicas por OCR**, desenvolvido pela própria equipe.

Com o MedTime, o usuário fotografa a receita ou o rótulo da caixa e o app preenche o cadastro automaticamente, reduzindo erros de digitação e simplificando o processo.

apresentação: https://canva.link/7yzkmbztfahzpb8

Artigo: https://www.overleaf.com/read/zmsqpqgtyrtq#e4b70c

---

## Funcionalidades

- ✅ Cadastro de medicamentos com nome, dosagem e horários
- 📷 Leitura de receitas e rótulos por câmera com OCR próprio
- 🔔 Lembretes diários por horário
- 📅 Dashboard com calendário e progresso do dia
- 📋 Histórico de doses tomadas
- 👤 Perfil de usuário com edição de dados
- 🌙 Modo escuro
- 🌐 Suporte a português e inglês
- ❓ Seção de ajuda com perguntas frequentes
- 🔐 Autenticação segura com JWT

---

## Arquitetura

```
medtime/
├── frontend/          # React Native + Expo
│   ├── src/
│   │   ├── screens/   # Telas do app
│   │   ├── components/# Componentes reutilizáveis (MedCard, MenuLateral...)
│   │   ├── context/   # Context API (estado global)
│   │   ├── navigation/# React Navigation
│   │   └── services/  # Chamadas à API
│   └── app.json
│
└── backend/           # Node.js + TypeScript + Express
    ├── src/
    │   ├── controllers/
    │   ├── entities/  # TypeORM entities
    │   ├── routes/
    │   ├── middlewares/
    │   └── config/
    └── tests/         # Jest
```

**Fluxo geral:** o frontend em React Native se comunica com a API REST via HTTP. O backend valida os dados com Zod, autentica com JWT e persiste no MySQL via TypeORM. O backend e o banco estão hospedados no Railway.

---

## Tecnologias

### Frontend
| Tecnologia | Uso |
|---|---|
| React Native | Base do app mobile |
| Expo | Build, câmera, notificações |
| React Navigation | Navegação entre telas |
| Context API | Gerenciamento de estado global |
| Expo Camera | Módulo de câmera para o OCR |

### Backend
| Tecnologia | Uso |
|---|---|
| Node.js + TypeScript | Servidor e tipagem |
| Express | Framework HTTP |
| TypeORM | ORM para MySQL |
| MySQL | Banco de dados relacional |
| JWT | Autenticação stateless |
| Zod | Validação de dados de entrada |
| Jest | Testes automatizados |

### Infraestrutura
| Serviço | Uso |
|---|---|
| Railway | Deploy do backend e banco de dados |

---

## Como rodar localmente

### Pré-requisitos

- Node.js 18+
- npm ou yarn
- MySQL rodando localmente (ou usar o banco no Railway)
- Expo Go instalado no celular, ou emulador Android/iOS configurado

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/medtime.git
cd medtime
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# edite o .env com suas credenciais
npm run dev
```

O servidor sobe por padrão na porta definida no `.env`.

### 3. Frontend

```bash
cd frontend
npm install
npx expo start
```

Escaneie o QR code com o Expo Go ou pressione `a` para Android / `i` para iOS.

> **Atenção:** certifique-se de que o celular e o computador estão na mesma rede Wi-Fi. Atualize a URL da API no frontend para o IP local da sua máquina.

---

## Variáveis de ambiente

Crie um arquivo `.env` dentro da pasta `backend` com base no `.env.example`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASS=sua_senha
DB_NAME=medtime

JWT_SECRET=sua_chave_secreta
```

---

## Testes

Os testes cobrem os principais endpoints da API e são executados com Jest:

```bash
cd backend
npm run test
```

---

## Deploy

O backend está hospedado no [Railway](https://railway.app). As variáveis de ambiente são configuradas direto no painel do Railway. O banco MySQL também está provisionado lá.

Para fazer um novo deploy basta fazer push na branch principal — o Railway detecta automaticamente e realiza o build.

---

## Módulo de OCR

O módulo de OCR foi desenvolvido integralmente pela equipe. O usuário abre a câmera dentro do app, enquadra a receita médica ou o rótulo da caixa do remédio e captura a imagem. O sistema processa a imagem, extrai o texto e preenche automaticamente os campos de nome do medicamento e instruções de uso no formulário de cadastro.

Funciona melhor com receitas impressas e legíveis. Receitas manuscritas podem apresentar menor precisão.

---

## Autores

| Nome | GitHub |
|------|--------|
| Gabriel Dornelles | https://github.com/Gabriel16dornelles |
| Davi Oliveira | https://github.com/DaviDeOliveiraAlves |
| Jorge Oliveira | https://github.com/JorgeOliveira2009 |

Projeto acadêmico desenvolvido no **Centro Universitário SENAC — São Leopoldo, RS**.

---

<div align="center">
  <sub>Feito com 💊 pelo time MedTime</sub>
</div>
