import { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

export const validate = (schema: z.ZodObject<any, any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.body = await schema.parseAsync(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                // USAR error.issues (Zod v3+) em vez de error.errors
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