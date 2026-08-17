import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// Função que recebe um schema do Zod e devolve um middleware pronto
// Assim dá pra validar qualquer rota só passando o schema dela, sem repetir código
export const validate = (schema: z.ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // valida o body da requisição contra o schema
            // o parseAsync também limpa campos que não estão no schema (segurança extra)
            req.body = await schema.parseAsync(req.body);
            next(); // dados válidos, pode seguir pro controller
        } catch (error) {
            if (error instanceof ZodError) {
                // pega só a primeira mensagem de erro pra não encher o app de texto
                // no Zod v3+ as mensagens ficam em error.issues (antes era error.errors)
                const primeiraMensagem = error.issues[0]?.message || "Dados inválidos";
                
                return res.status(400).json({
                    sucesso: false,
                    message: primeiraMensagem
                });
            }
            // se não foi erro do Zod, repassa pro middleware de erro global tratar
            next(error);
        }
    };
};