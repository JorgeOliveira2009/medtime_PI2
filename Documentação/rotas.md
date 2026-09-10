https://backend-or-main-production-2a36.up.railway.app/user/cadastro POST
https://backend-or-main-production-2a36.up.railway.app/user/login POST
https://backend-or-main-production-2a36.up.railway.app/user/listar GET com token
https://backend-or-main-production-2a36.up.railway.app/user/admin/deletar/id DELETE com token
https://backend-or-main-production-2a36.up.railway.app/user/atualizar PUT com token

Body:
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "12345678",
  "confirmarSenha": "12345678"
}

## Usuário

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | /user/cadastro | Cria uma conta nova |
| POST | /user/login | Loga e retorna o token JWT |
| GET | /user/perfil | Retorna os dados do usuário logado |
| PUT | /user/atualizar | Atualiza os dados do usuário logado |
| DELETE | /user/deletar-conta | Deleta a própria conta |
| GET | /user/listar | Lista todos os usuários (admin) |
| GET | /user/listar/:id | Busca um usuário pelo id (admin) |
| DELETE | /user/admin/deletar/:id | Deleta qualquer usuário pelo id (admin) |

---

## Remédio

| Método | Rota | O que faz |
|--------|------|-----------|
| POST | /remedio | Cria um remédio novo |
| GET | /remedio | Lista todos os remédios do usuário logado |
| GET | /remedio/:id | Busca um remédio pelo id |
| PUT | /remedio/:id | Atualiza os dados de um remédio |
| DELETE | /remedio/:id | Deleta um remédio |
| PATCH | /remedio/:id/tomado | Marca ou desmarca o remédio como tomado |
