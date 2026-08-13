import { Router } from "express";
import * as controller from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { validate } from "../middlewares/validate-middleware";
import { createUserScheme } from "../schemas/user.schema";

const router = Router();

// rotas públicas — qualquer um pode acessar sem token
// o validate() roda antes do controller e barra se os dados forem inválidos
router.post("/cadastro", validate(createUserScheme), controller.cadastro);
router.post("/login", validate(createUserScheme), controller.login);

// rotas protegidas — precisa passar pelo authMiddleware primeiro
// se o token for inválido/ausente, o authMiddleware já retorna 401 e para tudo
router.get("/listar", authMiddleware, controller.listar);
router.get("/listar/:id", authMiddleware, controller.listarPorId);
router.delete("/deletar/:id", authMiddleware, controller.deletar);
router.put("/atualizar/:id", authMiddleware, controller.atualizar);

export default router;