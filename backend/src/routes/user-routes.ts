import { Router } from "express";
import * as controller from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { validate } from "../middlewares/validate-middleware";
import { createUserScheme, loginScheme, updateUserScheme } from "../schemas/user.schema";

const router = Router();

// 🔓 ROTAS PÚBLICAS — qualquer um pode acessar, sem precisar de token
router.post("/cadastro", validate(createUserScheme), controller.cadastro);
router.post("/login", validate(loginScheme), controller.login);

// 🔒 ROTAS PROTEGIDAS — precisa estar logado (o authMiddleware checa o token)
router.get("/perfil", authMiddleware, controller.listarPerfil);           // pega os dados do usuário logado
router.put("/atualizar", authMiddleware, validate(updateUserScheme), controller.atualizar);  // atualiza dados do usuário logado
router.delete("/deletar-conta", authMiddleware, controller.deletarConta); // deleta a conta do usuário logado

// ⚠️ ROTAS ADMIN — só pra uso administrativo, ainda requer token
router.get("/listar", authMiddleware, controller.listar);                   // lista todos os usuários
router.get("/listar/:id", authMiddleware, controller.listarPorId);          // busca um usuário pelo id
router.delete("/admin/deletar/:id", authMiddleware, controller.deletar);    // deleta qualquer usuário pelo id

export default router;