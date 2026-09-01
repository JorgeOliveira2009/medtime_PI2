// src/schemas/remedio.schema.ts
import { z } from "zod";
// Zod é a biblioteca de validação — define as regras dos dados

// ==================== SCHEMA DE CRIAR ====================
export const criarRemedioSchema = z.object({

    nome: z.string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        // mínimo 2 caracteres — evita nomes tipo "a"
        .max(100, "Nome muito longo"),
        // máximo 100 — bate com o length: 100 lá no model

    horario: z.string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido — use o formato HH:MM"),
        // regex valida o formato do horário — vou destrinchar abaixo

    observacoes: z.string()
        .max(500, "Observações muito longas")
        .optional(),
        // optional() = não é obrigatório mandar esse campo
        // se não vier, o Zod não reclama

});
// nome e horario são obrigatórios — se não vierem, o Zod já barra

// ==================== SCHEMA DE ATUALIZAR ====================
export const atualizarRemedioSchema = z.object({

    nome: z.string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(100, "Nome muito longo")
        .optional(),
        // mesmas regras do criar, mas todos os campos são optional()
        // faz sentido — você pode querer atualizar só o horário

    horario: z.string()
        .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido — use o formato HH:MM")
        .optional(),

    observacoes: z.string()
        .max(500, "Observações muito longas")
        .optional(),

}).refine(data => data.nome || data.horario || data.observacoes, {
    message: "Pelo menos um campo deve ser fornecido",
});
// refine() é uma validação extra que roda depois das individuais
// o problema: se todos são optional(), alguém poderia mandar um body vazio {}
// o refine resolve isso — checa se pelo menos UM campo foi enviado
// se todos forem undefined, cai nesse erro