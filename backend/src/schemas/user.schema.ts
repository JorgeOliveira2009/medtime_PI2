import { z } from 'zod';

export const createUserScheme = z.object({
    email: z.string()
        .email("Email inválido")
        .min(1, "Email é obrigatório"),
    senha: z.string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .max(100, "Senha muito longa")
});

// Para login (pode ser igual ou diferente)
export const loginScheme = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "Senha é obrigatória")
});

// Para atualizar (todos opcionais)
export const updateUserScheme = z.object({
    email: z.string().email("Email inválido").optional(),
    senha: z.string().min(8, "Senha deve ter no mínimo 8 caracteres").optional()
}).refine(data => data.email || data.senha, {
    message: "Pelo menos um campo deve ser fornecido"
});