# MedTime — Documentação do Backend

Essa é a doc do backend do MedTime. Cobre a estrutura do projeto, como cada parte funciona e todas as rotas disponíveis. Nada muito formal, só o necessário pra entender o que tá rolando.

---

## Stack usada

- **Node.js + TypeScript** — base do servidor
- **Express** — framework que gerencia as rotas e middlewares
- **TypeORM** — faz a ponte entre o código e o banco de dados
- **MySQL** — banco de dados
- **JWT** — sistema de autenticação por token
- **Bcrypt** — criptografia de senha
- **Zod** — validação dos dados que chegam nas requisições
- **Swagger** — documentação visual das rotas (acessível em `/api-docs`)

---

## Estrutura de pastas

```
src/
├── config/
│   ├── database.ts        # configuração da conexão com o MySQL
│   ├── env-config.ts      # carrega e exporta as variáveis do .env
│   └── swagger.ts         # configuração da documentação Swagger
├── controller/
│   └── user-controller.ts # recebe as requisições e chama os services
├── middlewares/
│   ├── auth-middlewares.ts    # verifica o token JWT
│   ├── errors-middlewares.ts  # trata erros globalmente
│   └── validate-middleware.ts # valida o body com Zod
├── models/
│   └── user.ts            # define a tabela de usuários no banco
├── repositories/
│   └── user-repositories.ts  # todas as operações de banco do usuário
├── routes/
│   └── user-routes.ts     # define quais rotas existem e quem as protege
├── schemas/
│   └── user.schema.ts     # schemas Zod de validação
└── services/
    └── user-services.ts   # lógica de negócio (cadastro, login, etc.)
```

---

## Variáveis de ambiente (.env)

Cria um arquivo `.env` na raiz do projeto com isso:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_DATABASE=medtime
JWT_SECRET=uma_chave_secreta_qualquer
NODE_ENV=development
```

> ⚠️ Se o `JWT_SECRET` não estiver configurado, o servidor nem sobe — ele encerra sozinho antes de abrir.

---

## Como rodar

```bash
# instalar dependências
npm install

# rodar em desenvolvimento
npm run dev

# compilar e rodar em produção
npm run build
npm start
```

Servidor sobe na porta `3000`.
Documentação Swagger disponível em: `http://localhost:3000/api-docs`

---

## Fluxo geral

O caminho de uma requisição até a resposta é mais ou menos esse:

```
Requisição
    → Middleware de validação (Zod)   # verifica se os dados estão certos
    → Middleware de autenticação      # verifica o token (só nas rotas protegidas)
    → Controller                      # recebe a requisição e chama o service
    → Service                         # aplica a lógica (verificar email, gerar token, etc.)
    → Repository                      # fala com o banco de dados
    → Resposta
```

Se algum erro não for tratado no caminho, o middleware global de erros pega antes de chegar no usuário.

---

## Autenticação

O sistema usa **JWT (JSON Web Token)**. Funciona assim:

1. Usuário faz login com email e senha
2. O servidor verifica, e se tudo estiver certo, gera um token
3. Esse token precisa ser enviado no cabeçalho de todas as rotas protegidas

**Como mandar o token:**

```
Authorization: Bearer SEU_TOKEN_AQUI
```

O token expira em **7 dias**. Depois disso precisa fazer login de novo.

---

## Rotas

Base URL: `http://localhost:3000/user`

---

### 🔓 Rotas públicas

Essas não precisam de token.

---

#### `POST /user/cadastro`

Cadastra um novo usuário.

**Body:**
```json
{
  "nome": "Jorge",
  "email": "jorge@email.com",
  "senha": "minhasenha123",
  "confirmarSenha": "minhasenha123"
}
```

**Regras:**
- `nome` — mínimo 3 caracteres
- `email` — precisa ser um email válido
- `senha` — mínimo 8 caracteres
- `confirmarSenha` — precisa ser igual à senha

**Resposta (201):**
```json
{
  "sucesso": true,
  "user": {
    "id": 1,
    "nome": "Jorge",
    "email": "jorge@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Usuário criado com sucesso"
}
```

**Possíveis erros:**

| Status | Motivo |
|--------|--------|
| 400 | Dados inválidos (Zod) |
| 409 | Email já cadastrado |
| 500 | Erro interno |

---

#### `POST /user/login`

Autentica o usuário e retorna o token JWT.

**Body:**
```json
{
  "email": "jorge@email.com",
  "senha": "minhasenha123"
}
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Jorge",
    "email": "jorge@email.com"
  }
}
```

> O token retornado aqui é o que você vai usar nas rotas protegidas.

**Possíveis erros:**

| Status | Motivo |
|--------|--------|
| 400 | Dados inválidos (Zod) |
| 401 | Email ou senha incorretos |
| 500 | Erro interno |

---

### 🔒 Rotas protegidas

Essas precisam do token no cabeçalho. O token identifica quem está logado, então **não é necessário passar o id na URL** — o sistema pega do token automaticamente.

---

#### `GET /user/perfil`

Retorna os dados do usuário logado.

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "data": {
    "id": 1,
    "nome": "Jorge",
    "email": "jorge@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Possíveis erros:**

| Status | Motivo |
|--------|--------|
| 401 | Token ausente, inválido ou expirado |
| 404 | Usuário não encontrado |
| 500 | Erro interno |

---

#### `PUT /user/atualizar`

Atualiza os dados do usuário logado. Todos os campos são opcionais, mas pelo menos um precisa ser enviado.

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Body:**
```json
{
  "nome": "Jorge Novo",
  "email": "novoemail@email.com",
  "senha": "novasenha123"
}
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "user": {
    "id": 1,
    "nome": "Jorge Novo",
    "email": "novoemail@email.com",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "Dados atualizados com sucesso"
}
```

**Possíveis erros:**

| Status | Motivo |
|--------|--------|
| 400 | Nenhum campo enviado ou dados inválidos |
| 401 | Token ausente, inválido ou expirado |
| 404 | Usuário não encontrado |
| 500 | Erro interno |

---

#### `DELETE /user/deletar-conta`

Deleta a conta do usuário logado.

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "message": "Conta deletada com sucesso!"
}
```

**Possíveis erros:**

| Status | Motivo |
|--------|--------|
| 401 | Token ausente, inválido ou expirado |
| 404 | Usuário não encontrado |
| 500 | Erro interno |

---

### ⚠️ Rotas admin

Essas também precisam de token, mas são pra uso administrativo — listagem e deleção de qualquer conta.

---

#### `GET /user/listar`

Retorna todos os usuários cadastrados. A senha nunca é retornada.

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Resposta (200):**
```json
{
  "sucesso": true,
  "data": [
    {
      "id": 1,
      "nome": "Jorge",
      "email": "jorge@email.com",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### `GET /user/listar/:id`

Retorna um usuário específico pelo ID. O usuário logado só pode ver o próprio perfil — se tentar acessar outro ID recebe 403.

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Parâmetro:** `:id` — ID numérico do usuário

**Resposta (200):**
```json
{
  "sucesso": true,
  "data": {
    "id": 1,
    "nome": "Jorge",
    "email": "jorge@email.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Possíveis erros:**

| Status | Motivo |
|--------|--------|
| 401 | Token ausente, inválido ou expirado |
| 403 | Tentou acessar o perfil de outro usuário |
| 404 | Usuário não encontrado |
| 500 | Erro interno |

---

#### `DELETE /user/admin/deletar/:id`

Deleta qualquer usuário pelo ID.

**Headers:**
```
Authorization: Bearer SEU_TOKEN
```

**Parâmetro:** `:id` — ID numérico do usuário

**Resposta (200):**
```json
{
  "sucesso": true,
  "message": "Usuário deletado com sucesso!"
}
```

---

## Formato padrão das respostas

Todas as respostas seguem o mesmo formato base:

**Sucesso:**
```json
{
  "sucesso": true,
  "data": { ... }
}
```

**Erro:**
```json
{
  "sucesso": false,
  "message": "Descrição do erro"
}
```

Em ambiente de desenvolvimento, respostas de erro 500 também incluem o `stack` do erro pra facilitar o debug.

---

## Senhas

As senhas **nunca são salvas em texto puro** no banco. O bcrypt transforma a senha num hash antes de salvar, e na hora do login compara o que o usuário digitou com o hash salvo.

Isso significa que nem o próprio banco de dados sabe qual é a senha real do usuário.

---

## Erros do MySQL tratados automaticamente

O middleware global de erros reconhece alguns códigos do MySQL e devolve respostas legíveis:

| Código MySQL | O que significa | Status retornado |
|---|---|---|
| `ER_DUP_ENTRY` | Email duplicado | 409 |
| `ER_NO_REFERENCED_ROW_2` | Referência inválida entre tabelas | 400 |
| `ER_BAD_FIELD_ERROR` | Coluna que não existe foi usada | 400 |
