// src/routes/remedio-routes.ts
import { Router } from "express";
import * as controller from "../controller/remedio-controller";
import { authMiddleware } from "../middlewares/auth-middlewares";
import { validate } from "../middlewares/validate-middleware";
import { criarRemedioSchema, atualizarRemedioSchema } from "../schemas/remedio.schema";
// schemas do Zod — definem as regras de validação do body

const router = Router();

// todas as rotas aqui são protegidas — sem token, nenhuma funciona

router.post("/",          authMiddleware, validate(criarRemedioSchema),     controller.criar);
// POST /remedios → checa token → valida body → cria remédio
// precisa validar body pq vem dados (nome, horario, etc.)

router.get("/",           authMiddleware,                                    controller.listar);
// GET /remedios → checa token → lista todos os remédios do usuário logado
// sem validate pq GET não tem body

router.get("/:id",        authMiddleware,                                    controller.buscarPorId);
// GET /remedios/7 → checa token → busca remédio de id 7
// :id é dinâmico — vira req.params.id no controller

router.put("/:id",        authMiddleware, validate(atualizarRemedioSchema), controller.atualizar);
// PUT /remedios/7 → checa token → valida body → atualiza remédio de id 7
// PUT = manda os dados novos do remédio inteiro

router.delete("/:id",     authMiddleware,                                    controller.deletar);
// DELETE /remedios/7 → checa token → deleta remédio de id 7

router.patch("/:id/tomado", authMiddleware,                                  controller.marcarTomado);
// PATCH /remedios/7/tomado → checa token → marca/desmarca remédio de id 7
// PATCH = atualização parcial, só muda uma coisa específica
// diferente do PUT que manda tudo — aqui só toca no campo "tomado"

export default router;
// registrado no app.ts provavelmente assim:
// app.use("/remedios", remedioRouter)