import { Request, Response, NextFunction } from "express";
// Request = tipo da requisição
// Response = tipo da resposta
// NextFunction = função que chama o próximo passo (próximo middleware ou o controller)

import { criarRemedioSchema, atualizarRemedioSchema } from "../schemas/remedio.schema";
// schemas são as "regras" de validação definidas com Zod
// tipo: nome é obrigatório, dosagem tem que ser número, etc.

import { ZodError } from "zod";
// ZodError é o tipo de erro que o Zod joga quando os dados não batem com as regras

// ==================== VALIDAR CRIAR ====================
export const validarCriarRemedio = async (req: Request, res: Response, next: NextFunction) => {
    try {
        req.body = await criarRemedioSchema.parseAsync(req.body);
        // parseAsync tenta validar o req.body contra as regras do schema
        // se passar, ele SUBSTITUI o req.body pelo dado já validado e limpo
        // (o Zod pode transformar dados também, tipo converter string pra número)

        next();
        // tudo certo! chama o próximo na fila (o controller)
    } catch (error) {
        if (error instanceof ZodError) {
            // se o erro for de validação do Zod (dado inválido)...

            const primeiraMensagem = error.issues[0]?.message || "Dados inválidos";
            // error.issues é um array com todos os erros encontrados
            // a gente pega só o primeiro pra não mandar uma lista enorme pro front
            // o "|| 'Dados inválidos'" é um fallback caso issues esteja vazio

            return res.status(400).json({ sucesso: false, message: primeiraMensagem });
            // 400 = dado inválido, culpa de quem mandou a requisição
            // para tudo aqui, não chama next()
        }
        next(error);
        // se o erro NÃO for do Zod (erro inesperado), passa o erro pra frente
        // o Express vai tratar como erro 500 automático
    }
};

// ==================== VALIDAR ATUALIZAR ====================
export const validarAtualizarRemedio = async (req: Request, res: Response, next: NextFunction) => {
    // mesma lógica de cima, mas usando o schema de atualizar
    // a diferença entre os dois schemas provavelmente é que no atualizar
    // os campos são opcionais (você pode atualizar só o nome, por exemplo)
    try {
        req.body = await atualizarRemedioSchema.parseAsync(req.body);
        next();
    } catch (error) {
        if (error instanceof ZodError) {
            const primeiraMensagem = error.issues[0]?.message || "Dados inválidos";
            return res.status(400).json({ sucesso: false, message: primeiraMensagem });
        }
        next(error);
    }
};