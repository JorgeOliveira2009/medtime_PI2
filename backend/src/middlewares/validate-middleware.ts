import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Função que recebe um schema do Zod e devolve um middleware pronto
// Assim dá pra validar qualquer rota só passando o schema dela, sem repetir código
export const validate = (schema: z.ZodTypeAny) => {  // ZodTypeAny aceita ZodObject E ZodEffects
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const primeiraMensagem = error.issues[0]?.message || "Dados inválidos";
                return res.status(400).json({
                    sucesso: false,
                    message: primeiraMensagem
                });
            }
            next(error);
        }
    };
};