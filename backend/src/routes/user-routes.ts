import { Router } from "express";
import * as controller from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middlewares"; // 👈 muda aqui
import { validate } from "../middlewares/validate-middleware";
import { createUserScheme } from "../schemas/user.schema";

const router = Router();

router.post("/cadastro", validate(createUserScheme), controller.cadastro);
router.post("/login", validate(createUserScheme), controller.login);
router.get("/listar", authMiddleware, controller.listar); // 👈 usa authMiddleware
router.get("/listar/:id", authMiddleware, controller.listarPorId);
router.delete("/deletar/:id", authMiddleware, controller.deletar);
router.put("/atualizar/:id", authMiddleware, controller.atualizar);

export default router;