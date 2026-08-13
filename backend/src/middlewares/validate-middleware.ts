import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

// factory que recebe um schema zod e devolve um middleware
// assim dá pra reusar pra qualquer rota passando schemas diferentes
export const validate = (schema: z.ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            // valida e substitui o body pelo valor já parseado/limpo pelo zod
            req.body = await schema.parseAsync(req.body);
            next(); // tudo certo, passa pro controller
        } catch (error) {
            if (error instanceof ZodError) {
                // pega só a primeira mensagem de erro (não precisa mandar todas)
                // em zod v3+ usa error.issues em vez de error.errors
                const primeiraMensagem = error.issues[0]?.message || "Dados inválidos";
                
                return res.status(400).json({
                    sucesso: false,
                    message: primeiraMensagem
                });
            }
            // se não for erro do zod, passa pro middleware de erro global
            next(error);
        }
    };
};