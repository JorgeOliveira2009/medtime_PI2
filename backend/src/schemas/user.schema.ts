import { z } from 'zod';

// schema de cadastro — valida email e senha com regras específicas
export const createUserScheme = z.object({
    email: z.string()
        .email("Email inválido")       // tem que ter @ e domínio
        .min(1, "Email é obrigatório"), // não pode ser vazio
    senha: z.string()
        .min(8, "Senha deve ter no mínimo 8 caracteres") // mínimo 8 chars
        .max(100, "Senha muito longa")                   // máximo 100 chars
});

// schema de login — senha pode ser qualquer coisa (não tem mínimo de chars)
// porque o hash no banco tem tamanho diferente da senha original
export const loginScheme = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "Senha é obrigatória")
});

// schema de atualização — os dois campos são opcionais
// mas o .refine() no final garante que pelo menos um foi enviado
export const updateUserScheme = z.object({
    email: z.string().email("Email inválido").optional(),
    senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").optional()
}).refine(data => data.email || data.senha, {
    message: "Pelo menos um campo deve ser fornecido"
});