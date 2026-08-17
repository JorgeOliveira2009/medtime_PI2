import { z } from 'zod';

// Schema de cadastro — define as regras que o body da requisição precisa seguir
// O Zod valida tudo isso antes de chegar no controller
export const createUserScheme = z.object({
    nome: z.string()
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(100, "Nome muito longo"),
    email: z.string()
        .email("Email inválido")
        .min(1, "Email é obrigatório"),
    senha: z.string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .max(100, "Senha muito longa"),
    confirmarSenha: z.string()
        .min(1, "Confirme sua senha")
// .refine é uma validação extra que compara dois campos — não dá pra fazer só com as regras de cima
}).refine(data => data.senha === data.confirmarSenha, {
    message: "Senhas não conferem",
    path: ["confirmarSenha"] // aponta qual campo está com erro
});

// Schema de login — bem simples, só valida o formato do email e que a senha não tá vazia
export const loginScheme = z.object({
    email: z.string().email("Email inválido"),
    senha: z.string().min(1, "Senha é obrigatória")
});

// Schema de atualização — todos os campos são opcionais (o usuário pode mudar só o que quiser)
// mas pelo menos um precisa ser enviado (o .refine lá embaixo garante isso)
export const updateUserScheme = z.object({
    nome: z.string()
        .min(3, "Nome deve ter pelo menos 3 caracteres")
        .max(100, "Nome muito longo")
        .optional(),
    email: z.string()
        .email("Email inválido")
        .optional(),
    senha: z.string()
        .min(8, "Senha deve ter no mínimo 8 caracteres")
        .max(100, "Senha muito longa")
        .optional()
// garante que pelo menos um dos três campos foi enviado
}).refine(data => data.nome || data.email || data.senha, {
    message: "Pelo menos um campo deve ser fornecido"
});