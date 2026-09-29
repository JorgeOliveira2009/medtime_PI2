import { Router } from "express";
import * as controller from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { validate } from "../middlewares/validate-middleware";
import { createUserScheme, loginScheme, updateUserScheme } from "../schemas/user.schema";
import { loginRateLimit, cadastroRateLimit } from "../middlewares/rate-limit.middlewares";
// loginRateLimit e cadastroRateLimit = limitam tentativas por IP
// evita ataque de força bruta no login e criação em massa de contas falsas

const router = Router();

// ==================== ROTAS PÚBLICAS ====================
// sem authMiddleware — qualquer um acessa sem precisar de token

router.post("/cadastro", cadastroRateLimit, validate(createUserScheme), controller.cadastro);
// POST /usuarios/cadastro → limita tentativas → valida body → cria conta

router.post("/login",    loginRateLimit,    validate(loginScheme),       controller.login);
// POST /usuarios/login → limita tentativas → valida body → loga e retorna token

// ==================== ROTAS PROTEGIDAS ====================
// authMiddleware checa se o token JWT é válido antes de deixar passar

router.get("/perfil", authMiddleware, controller.listarPerfil);
// GET /usuarios/perfil → checa token → retorna dados do usuário logado
// não precisa de :id — o authMiddleware já sabe quem é pelo token

router.put("/atualizar", authMiddleware, validate(updateUserScheme), controller.atualizar);
// PUT /usuarios/atualizar → checa token → valida body → atualiza dados
// também sem :id — você só pode atualizar você mesmo

router.delete("/deletar-conta", authMiddleware, controller.deletarConta);
// DELETE /usuarios/deletar-conta → checa token → deleta a própria conta

// ==================== ROTAS ADMIN ====================
// ⚠️ só tem authMiddleware — qualquer usuário logado consegue acessar
// numa aplicação real precisaria de um adminMiddleware separado
// que checasse se o usuário tem role de administrador

router.get("/listar", authMiddleware, controller.listar);
// GET /usuarios/listar → lista TODOS os usuários do sistema

router.get("/listar/:id", authMiddleware, controller.listarPorId);
// GET /usuarios/listar/5 → busca qualquer usuário pelo id
// :id é dinâmico — vira req.params.id no controller

router.delete("/admin/deletar/:id", authMiddleware, controller.deletar);
// DELETE /usuarios/admin/deletar/5 → deleta qualquer usuário pelo id
// o "/admin/" na URL é só visual — não protege nada tecnicamente

export default router;
// exporta pra ser registrado no app.ts, provavelmente assim:
// app.use("/usuarios", userRouter)