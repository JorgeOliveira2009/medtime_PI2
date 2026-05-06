import { Router } from "express";
import * as controller from "../controller/user-controller";

const router = Router();

router.post("/cadastro", controller.cadastro);
router.get("/listar", controller.listar);
router.get("/listar/:id", controller.listarPorId);
router.post("/login", controller.login);
router.delete("/deletar/:id", controller.deletar);
router.put("/atualizar/:id", controller.atualizar);

export default router;