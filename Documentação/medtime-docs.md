# MedTime API — Documentação

> Backend REST para gerenciamento de usuários com autenticação JWT, validação Zod e ORM MySQL.

---

## Índice

- [Visão Geral](#visão-geral)
- [Arquitetura](#arquitetura)
- [Autenticação](#autenticação)
- [Padrão de Respostas](#padrão-de-respostas)
- [Rotas](#rotas)
  - [POST /cadastro](#post-usercadastro)
  - [POST /login](#post-userlogin)
  - [GET /listar](#get-userlistar)
  - [GET /listar/:id](#get-userlistarid)
  - [PUT /atualizar/:id](#put-useratualizarid)
  - [DELETE /deletar/:id](#delete-userdeletarid)
- [Schemas de Validação](#schemas-de-validação-zod)
- [Model Usuario](#model-usuario-typeorm)
- [Variáveis de Ambiente](#variáveis-de-ambiente)

---

## Visão Geral

| Campo | Valor |
|---|---|
| Base URL | `http://localhost:3000` |
| Prefixo das rotas | `/user` |
| Total de endpoints | 6 |
| Rotas protegidas | 4 de 6 |
| Docs Swagger | `http://localhost:3000/api-docs` |

**Stack:** Node.js · TypeScript · Express · TypeORM · MySQL · JWT · bcrypt · Zod · Swagger UI

---

## Arquitetura

Estrutura em camadas — cada responsabilidade isolada em seu módulo.

```
Cliente
   │
   ▼
src/routes/user-routes.ts          ← mapeamento de endpoints + aplicação de middlewares
   │
   ▼
src/middlewares/
   ├── validate-middleware.ts      ← valida o body com Zod antes de continuar
   ├── auth-middlewares.ts         ← verifica o JWT nas rotas protegidas
   └── errors-middlewares.ts       ← captura erros globais e formata a resposta
   │
   ▼
src/controller/user-controller.ts  ← recebe req/res, chama o service, devolve resposta
   │
   ▼
src/services/user-services.ts      ← toda a lógica de negócio (bcrypt, jwt, regras)
   │
   ▼
src/repositories/user-repositories.ts  ← abstração do TypeORM (operações no banco)
   │
   ▼
MySQL — banco: medtime / tabela: usuarios
```

### Fluxo de uma requisição protegida

```
Cliente → Express → authMiddleware → Controller → Service → Repository → MySQL
                         │
                    (token inválido)
                         │
                      401 Unauthorized
```

---

## Autenticação

As rotas marcadas com 🔒 exigem um token JWT no header `Authorization`.

### Como usar

1. Faça login em `POST /user/login` e copie o `token` da resposta.
2. Inclua o token em todas as requisições protegidas:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Detalhes do token

| Campo | Valor |
|---|---|
| Algoritmo | HS256 |
| Expiração | 24 horas |
| Payload | `{ id, email }` |
| Secret | variável de ambiente `JWT_SECRET` |

### Erros de autenticação

| Status | Mensagem | Causa |
|---|---|---|
| `401` | Token não fornecido | Header `Authorization` ausente |
| `401` | Token mal formatado | Não segue o padrão `Bearer <token>` |
| `401` | Token expirado, faça login novamente | Token com mais de 24h |
| `401` | Token inválido | Assinatura incorreta ou token adulterado |

---

## Padrão de Respostas

Todas as rotas seguem a mesma estrutura de resposta.

**Sucesso:**
```json
{
  "sucesso": true,
  "message": "Operação realizada com sucesso!",
  "data": { }
}
```

**Erro:**
```json
{
  "sucesso": false,
  "message": "Descrição do erro"
}
```

### Tabela de status HTTP

| Status | Significado | Quando acontece |
|---|---|---|
| `200` | OK | Requisição bem-sucedida (GET, PUT, DELETE) |
| `201` | Created | Recurso criado com sucesso (cadastro) |
| `400` | Bad Request | Validação Zod falhou, campos inválidos |
| `401` | Unauthorized | Token ausente, inválido ou expirado |
| `404` | Not Found | Usuário não encontrado pelo ID |
| `409` | Conflict | Email já cadastrado no banco |
| `500` | Internal Server Error | Erro inesperado no servidor |

---

## Rotas

> Todas as rotas têm o prefixo `/user`.  
> Exemplo completo: `POST http://localhost:3000/user/cadastro`

---

### POST /user/cadastro

Registra um novo usuário. A senha é armazenada como hash bcrypt.

**Request body:**

| Campo | Tipo | Regras | |
|---|---|---|---|
| `email` | string | Formato de email válido | obrigatório |
| `senha` | string | Mínimo 8 caracteres, máximo 100 | obrigatório |

```json
{
  "email": "jorge@email.com",
  "senha": "minhaSenha123"
}
```

**Respostas:**

| Status | Descrição |
|---|---|
| `201` | Usuário criado com sucesso |
| `400` | Email inválido ou senha fora do tamanho permitido |
| `409` | Email já cadastrado — tente outro |
| `500` | Erro interno do servidor |

**Resposta 201:**
```json
{
  "sucesso": true,
  "message": "Usuário criado com sucesso"
}
```

---

### POST /user/login

Valida as credenciais e retorna um token JWT com validade de 24h.

**Request body:**

| Campo | Tipo | Regras | |
|---|---|---|---|
| `email` | string | Formato de email válido | obrigatório |
| `senha` | string | Não pode ser vazia | obrigatório |

```json
{
  "email": "jorge@email.com",
  "senha": "minhaSenha123"
}
```

**Respostas:**

| Status | Descrição |
|---|---|
| `200` | Login realizado — retorna token |
| `200` | `sucesso: false` — email não encontrado ou senha incorreta |
| `400` | Validação Zod falhou |
| `500` | Erro interno do servidor |

> ⚠️ **Atenção:** credenciais erradas retornam `200` com `sucesso: false` (não `401`). Considere retornar `401` em versões futuras.

**Resposta 200 (sucesso):**
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "jorge@email.com"
  }
}
```

**Resposta 200 (credenciais erradas):**
```json
{
  "sucesso": false,
  "message": "Senha incorreta"
}
```

---

### GET /user/listar

🔒 **Requer autenticação JWT**

Retorna array com todos os usuários cadastrados.

**Respostas:**

| Status | Descrição |
|---|---|
| `200` | Lista de usuários (pode ser array vazio) |
| `401` | Token inválido ou ausente |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "data": [
    {
      "id": 1,
      "email": "jorge@email.com",
      "senha": "$2b$10$..."
    }
  ]
}
```

---

### GET /user/listar/:id

🔒 **Requer autenticação JWT**

Retorna os dados de um usuário específico.

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | integer | ID numérico do usuário |

**Respostas:**

| Status | Descrição |
|---|---|
| `200` | Dados do usuário encontrado |
| `401` | Token inválido ou ausente |
| `404` | Nenhum usuário com esse ID |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "data": {
    "id": 1,
    "email": "jorge@email.com",
    "senha": "$2b$10$..."
  }
}
```

---

### PUT /user/atualizar/:id

🔒 **Requer autenticação JWT**

Atualiza email e/ou senha de um usuário. Pelo menos um dos campos deve ser enviado.

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | integer | ID do usuário a atualizar |

**Request body:**

| Campo | Tipo | Regras | |
|---|---|---|---|
| `email` | string | Email válido | opcional |
| `senha` | string | Mínimo 8 caracteres | opcional |

> ⚠️ Pelo menos um dos campos deve ser enviado — caso contrário retorna `400`.

```json
{
  "email": "novo@email.com",
  "senha": "novaSenha123"
}
```

**Respostas:**

| Status | Descrição |
|---|---|
| `200` | Usuário atualizado com sucesso |
| `400` | Nenhum campo enviado ou validação falhou |
| `401` | Token inválido ou ausente |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "message": "Usuário atualizado com sucesso!"
}
```

---

### DELETE /user/deletar/:id

🔒 **Requer autenticação JWT**

Remove um usuário pelo ID.

**Parâmetros de rota:**

| Parâmetro | Tipo | Descrição |
|---|---|---|
| `id` | integer | ID do usuário a deletar |

**Respostas:**

| Status | Descrição |
|---|---|
| `200` | Usuário deletado com sucesso |
| `401` | Token inválido ou ausente |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "message": "Usuário deletado com sucesso!"
}
```

---

## Schemas de Validação (Zod)

Todos os dados de entrada passam pelo middleware `validate()` antes de chegar ao controller. Em caso de falha, retorna `400` com a primeira mensagem de erro do Zod.

### createUserScheme

Usado em `POST /cadastro`.

```typescript
z.object({
  email: z.string()
    .email("Email inválido")
    .min(1, "Email é obrigatório"),
  senha: z.string()
    .min(8, "Senha deve ter no mínimo 8 caracteres")
    .max(100, "Senha muito longa"),
})
```

### loginScheme

Usado em `POST /login`.

```typescript
z.object({
  email: z.string().email("Email inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
})
```

### updateUserScheme

Usado em `PUT /atualizar/:id`. Todos os campos são opcionais, mas pelo menos um deve ser enviado (`.refine()`).

```typescript
z.object({
  email: z.string().email("Email inválido").optional(),
  senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").optional(),
}).refine(data => data.email || data.senha, {
  message: "Pelo menos um campo deve ser fornecido",
})
```

---

## Model Usuario (TypeORM)

Entidade mapeada para a tabela `usuarios` no MySQL com `synchronize: true`.

### Colunas

| Coluna | Tipo SQL | Restrições | Decorador TypeORM |
|---|---|---|---|
| `id` | `INT AUTO_INCREMENT` | PRIMARY KEY | `@PrimaryGeneratedColumn()` |
| `email` | `VARCHAR(100)` | UNIQUE, NOT NULL | `@Column({ unique: true, nullable: false })` |
| `senha` | `VARCHAR(255)` | NOT NULL | `@Column({ nullable: false })` |

### Métodos do repositório

| Método | Retorno | Operação |
|---|---|---|
| `criar(usuario)` | `Usuario` | INSERT |
| `buscarTodos()` | `Usuario[]` | SELECT * |
| `buscarPorId(id)` | `Usuario \| null` | SELECT WHERE id |
| `buscarPorEmail(email)` | `Usuario \| null` | SELECT WHERE email |
| `atualizar(usuario)` | `Usuario` | UPDATE via `save()` |
| `deletar(id)` | `void` | DELETE WHERE id |

### Configuração do DataSource

```typescript
{
  type: "mysql",
  host: "localhost",
  port: 3306,
  database: "medtime",
  synchronize: true,   // ⚠️ só em desenvolvimento
  logging: true,
  entities: [Usuario],
}
```

> ⚠️ `synchronize: true` recria/altera tabelas automaticamente. **Nunca use em produção** — use migrations do TypeORM.

---

## Variáveis de Ambiente

Crie um arquivo `.env` na raiz do backend com as seguintes variáveis:

```env
# Banco de dados
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=medtime
DB_USER=root
DB_PASSWORD=root

# JWT
JWT_SECRET=sua_chave_secreta_aqui
```

> ⚠️ Nunca suba o `.env` para o repositório. Adicione ao `.gitignore`.
