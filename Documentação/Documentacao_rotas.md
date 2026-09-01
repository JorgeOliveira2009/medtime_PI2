# 📋 API de Usuários — MedTime

Base URL: `http://localhost:3000/user`

---

## 🔓 Rotas Públicas

### POST `/user/cadastro`
Cria um novo usuário.

**Body:**
```json
{
  "nome": "Jorge Silva",
  "email": "jorge@email.com",
  "senha": "minhasenha123",
  "confirmarSenha": "minhasenha123"
}
```

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `201` | Usuário criado com sucesso |
| `400` | Dados inválidos (ex: senhas não conferem, email inválido) |
| `409` | Email já cadastrado |
| `429` | Muitas tentativas — tente em 1 hora |
| `500` | Erro interno do servidor |

**Resposta 201:**
```json
{
  "sucesso": true,
  "message": "Usuário criado com sucesso",
  "user": {
    "id": 1,
    "nome": "Jorge Silva",
    "email": "jorge@email.com",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### POST `/user/login`
Autentica o usuário e retorna o token JWT.

**Body:**
```json
{
  "email": "jorge@email.com",
  "senha": "minhasenha123"
}
```

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Login realizado com sucesso |
| `400` | Dados inválidos |
| `401` | Email ou senha inválidos |
| `429` | Muitas tentativas — tente em 15 minutos |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "nome": "Jorge Silva",
    "email": "jorge@email.com"
  }
}
```

> ⚠️ O token expira em **7 dias**. Após isso, o usuário precisa fazer login novamente.

---

## 🔒 Rotas Protegidas

Todas as rotas abaixo exigem o token JWT no header:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

---

### GET `/user/perfil`
Retorna os dados do usuário logado.

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Dados retornados com sucesso |
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "data": {
    "id": 1,
    "nome": "Jorge Silva",
    "email": "jorge@email.com",
    "createdAt": "2025-01-01T10:00:00.000Z"
  }
}
```

---

### PUT `/user/atualizar`
Atualiza os dados do usuário logado. Pelo menos um campo deve ser enviado.

**Body:**
```json
{
  "nome": "Jorge Novo",
  "email": "novo@email.com",
  "senha": "novasenha123"
}
```

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Dados atualizados com sucesso |
| `400` | Nenhum campo enviado ou dados inválidos |
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "message": "Dados atualizados com sucesso",
  "user": {
    "id": 1,
    "nome": "Jorge Novo",
    "email": "novo@email.com",
    "updatedAt": "2025-01-02T10:00:00.000Z"
  }
}
```

---

### DELETE `/user/deletar-conta`
Deleta a conta do usuário logado.

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Conta deletada com sucesso |
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "message": "Conta deletada com sucesso!"
}
```

---

## 🛡️ Rotas Admin

Requerem token JWT. Para uso administrativo.

---

### GET `/user/listar`
Retorna todos os usuários cadastrados.

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Lista retornada com sucesso |
| `401` | Token ausente, inválido ou expirado |
| `500` | Erro interno do servidor |

**Resposta 200:**
```json
{
  "sucesso": true,
  "data": [
    {
      "id": 1,
      "nome": "Jorge Silva",
      "email": "jorge@email.com",
      "createdAt": "2025-01-01T10:00:00.000Z"
    }
  ]
}
```

---

### GET `/user/listar/:id`
Retorna um usuário pelo ID. O usuário só pode buscar o próprio perfil.

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | `integer` | ID do usuário |

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Usuário encontrado |
| `400` | ID inválido |
| `401` | Token ausente, inválido ou expirado |
| `403` | Tentativa de acessar perfil de outro usuário |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

---

### DELETE `/user/admin/deletar/:id`
Deleta qualquer usuário pelo ID.

**Parâmetros:**

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | `integer` | ID do usuário a deletar |

**Respostas:**

| Status | Descrição |
|--------|-----------|
| `200` | Usuário deletado com sucesso |
| `400` | ID inválido |
| `401` | Token ausente, inválido ou expirado |
| `404` | Usuário não encontrado |
| `500` | Erro interno do servidor |

---

## ⚡ Rate Limit

| Rota | Limite | Janela |
|------|--------|--------|
| `POST /login` | 5 tentativas | 15 minutos |
| `POST /cadastro` | 10 tentativas | 1 hora |
| Todas as outras | 100 requisições | 15 minutos |

---

## 📌 Padrão de Erro

Todas as respostas de erro seguem o mesmo formato:

```json
{
  "sucesso": false,
  "message": "Descrição do erro"
}
```