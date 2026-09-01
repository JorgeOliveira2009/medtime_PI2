# 📱 MedTime — Backend expliacaçãp


---

## 🗂️ Estrutura de Pastas

```
BACKEND_MEDTIME/
├── backend/
│   └── server.ts               # Ponto de entrada — sobe o servidor
└── src/
    ├── config/
    │   ├── database.ts         # Configuração do banco MySQL
    │   ├── env-config.ts       # Variáveis de ambiente (.env)
    │   └── swagger.ts          # Documentação visual da API
    ├── controller/
    │   ├── user-controller.ts  # Recebe as requisições de usuário
    │   └── remedio-controller.ts # Recebe as requisições de remédio
    ├── middlewares/
    │   ├── auth-middlewares.ts      # Verifica o token JWT
    │   ├── validate-middleware.ts   # Valida os dados antes do controller
    │   ├── rate-limit.middleware.ts # Limita tentativas de acesso
    │   └── errors-middlewares.ts    # Trata erros globais
    ├── models/
    │   ├── user.ts             # Tabela de usuários no banco
    │   └── remedio.ts          # Tabela de remédios no banco
    ├── repositories/
    │   ├── user-repositories.ts    # Queries de usuário no banco
    │   └── remedio-repositories.ts # Queries de remédio no banco
    ├── routes/
    │   ├── user-routes.ts      # Rotas de usuário
    │   └── remedio-routes.ts   # Rotas de remédio
    ├── schemas/
    │   ├── user.schema.ts      # Regras de validação de usuário
    │   └── remedio.schema.ts   # Regras de validação de remédio
    └── services/
        ├── user-services.ts    # Lógica de negócio de usuário
        └── remedio-services.ts # Lógica de negócio de remédio
```

---

## 🔄 Como funciona o fluxo de uma requisição?

Toda requisição passa por essas etapas em ordem:

```
App Mobile
    ↓
Rate Limit       → muitas tentativas? bloqueia
    ↓
Rota             → qual endpoint foi chamado?
    ↓
Auth Middleware  → tem token JWT válido? (rotas protegidas)
    ↓
Validate         → os dados estão corretos?
    ↓
Controller       → recebe a requisição
    ↓
Service          → executa a lógica de negócio
    ↓
Repository       → faz a query no banco
    ↓
Banco MySQL      → retorna os dados
    ↓
App Mobile       ← resposta JSON
```

---

## 🗄️ Banco de Dados

### Tabela `usuarios`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Chave primária, auto incremento |
| `nome` | varchar(100) | Nome do usuário |
| `email` | varchar(100) | Email único |
| `senha` | varchar(255) | Senha criptografada com bcrypt |
| `created_at` | datetime | Data de criação |
| `updated_at` | datetime | Data da última atualização |

### Tabela `remedios`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `id` | int | Chave primária, auto incremento |
| `nome` | varchar(100) | Nome do remédio |
| `horario` | varchar(5) | Horário de tomar — formato HH:MM |
| `tomado` | boolean | Se já tomou hoje (padrão: false) |
| `observacoes` | text | Campo livre opcional |
| `usuario_id` | int | Chave estrangeira — dono do remédio |
| `created_at` | datetime | Data de criação |
| `updated_at` | datetime | Data da última atualização |

> ⚠️ O campo `tomado` precisa ser resetado para `false` todo dia à meia-noite via cron job (ainda não implementado).

---

## 🔐 Autenticação

O projeto usa **JWT (JSON Web Token)**. Funciona assim:

1. Usuário faz login → recebe um token
2. Guarda o token no app
3. Manda o token em toda requisição protegida no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

4. O token expira em **7 dias** — aí precisa fazer login de novo

---

## 🛡️ Segurança

| Recurso | O que faz |
|---------|-----------|
| **bcrypt** | Criptografa a senha antes de salvar — nunca salva senha pura |
| **JWT** | Autentica o usuário sem precisar de sessão |
| **Zod** | Valida todos os dados antes de chegar no banco |
| **Rate Limit** | Bloqueia tentativas em excesso |

### Limites de Rate Limit

| Rota | Limite | Janela |
|------|--------|--------|
| `POST /user/login` | 5 tentativas | 15 minutos |
| `POST /user/cadastro` | 10 tentativas | 1 hora |
| Todas as outras | 100 requisições | 15 minutos |

---

## 🌐 Rotas

### Usuários — Base URL: `/user`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/cadastro` | ❌ | Criar conta |
| `POST` | `/login` | ❌ | Fazer login |
| `GET` | `/perfil` | ✅ | Ver próprio perfil |
| `PUT` | `/atualizar` | ✅ | Atualizar próprios dados |
| `DELETE` | `/deletar-conta` | ✅ | Deletar própria conta |
| `GET` | `/listar` | ✅ | Listar todos os usuários (admin) |
| `GET` | `/listar/:id` | ✅ | Buscar usuário por ID (admin) |
| `DELETE` | `/admin/deletar/:id` | ✅ | Deletar qualquer usuário (admin) |

### Remédios — Base URL: `/remedio`

| Método | Rota | Auth | Descrição |
|--------|------|------|-----------|
| `POST` | `/` | ✅ | Cadastrar remédio |
| `GET` | `/` | ✅ | Listar remédios do usuário |
| `GET` | `/:id` | ✅ | Buscar remédio por ID |
| `PUT` | `/:id` | ✅ | Atualizar remédio |
| `DELETE` | `/:id` | ✅ | Deletar remédio |
| `PATCH` | `/:id/tomado` | ✅ | Marcar/desmarcar como tomado |

---

## 📦 Principais Pacotes

| Pacote | Para que serve |
|--------|----------------|
| `express` | Framework do servidor |
| `typeorm` | Conecta e gerencia o banco MySQL |
| `mysql2` | Driver do MySQL |
| `bcrypt` | Criptografia de senha |
| `jsonwebtoken` | Geração e validação do JWT |
| `zod` | Validação de dados |
| `express-rate-limit` | Rate limiting |
| `cors` | Permite acesso do app mobile |
| `swagger-ui-express` | Documentação visual em `/api-docs` |

---

## ⚙️ Variáveis de Ambiente

Cria um arquivo `.env` na raiz com:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=medtime
JWT_SECRET=sua_chave_secreta_longa
JWT_EXPIRES_IN=7d
```

---

## 🚀 Como rodar localmente

```bash
# 1. Instalar dependências
npm install

# 2. Criar o .env com as variáveis acima

# 3. Rodar em desenvolvimento
npm run dev

# 4. Acessar a documentação visual
http://localhost:3000/api-docs
```

---

## ☁️ Deploy (Railway)

```bash
# 1. Instalar o CLI
npm install -g @railway/cli

# 2. Fazer login
railway login

# 3. Linkar o projeto
railway link

# 4. Subir
railway up
```

### Variáveis no Railway

Adiciona essas variáveis no painel do Railway → Variables:

```env
DB_HOST=mysql.railway.internal
DB_PORT=3306
DB_USER=root
DB_PASSWORD=senha_gerada_pelo_railway
DB_DATABASE=railway
JWT_SECRET=chave_gerada_com_crypto
JWT_EXPIRES_IN=7d
```

---

## 🔮 O que ainda falta implementar

| Feature | Descrição |
|---------|-----------|
| **Cron job** | Resetar `tomado` pra `false` todo dia à meia-noite |
| **Notificações** | Avisar o usuário na hora de tomar o remédio via Telegram ou Expo |
| **Testes** | Jest já está instalado mas os testes ainda não foram escritos |