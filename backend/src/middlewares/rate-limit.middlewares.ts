// src/middlewares/rate-limit.middleware.ts
import rateLimit from "express-rate-limit";

// Mensagem padrão de erro
const rateLimitResponse = (message: string) => ({
    sucesso: false,
    message
});

// LOGIN — mais restrito, 5 tentativas a cada 15 minutos
// evita brute force de senha
export const loginRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: rateLimitResponse("Muitas tentativas de login. Tente novamente em 15 minutos."),
    skipSuccessfulRequests: true, // só conta tentativas que falharam
});

// CADASTRO — menos restrito, 10 tentativas por hora
// evita criação em massa de contas
export const cadastroRateLimit = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: rateLimitResponse("Muitos cadastros realizados. Tente novamente em 1 hora."),
});

// GERAL — proteção global pra toda a API, 100 req por 15 minutos
export const globalRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: rateLimitResponse("Muitas requisições. Tente novamente em alguns minutos."),
});