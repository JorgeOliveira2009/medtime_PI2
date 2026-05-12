import { Router } from "express";
import * as controller from "../controller/user-controller";
import { authMiddleware } from "../middlewares/auth-middlewares"; // 👈 muda aqui

const router = Router();

router.post("/cadastro", controller.cadastro);
router.get("/listar", authMiddleware, controller.listar); // 👈 usa authMiddleware
router.get("/listar/:id", authMiddleware, controller.listarPorId);
router.post("/login", controller.login);
router.delete("/deletar/:id", authMiddleware, controller.deletar);
router.put("/atualizar/:id", authMiddleware, controller.atualizar);

export default router;