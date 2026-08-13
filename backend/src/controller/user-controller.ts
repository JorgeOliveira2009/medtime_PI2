import { Request, Response } from "express";
import * as service from "../services/user-services";
import { createUserScheme, updateUserScheme } from '../schemas/user.schema';

// essa função roda quando alguém tenta se cadastrar
export const cadastro = async (req: Request, res: Response) => {
    try {
        // pega o email e senha que vieram no body da requisição
        // (o middleware já validou antes, então tá tudo certo aqui)
        const { email, senha } = req.body;
        
        // manda pro service fazer o trabalho pesado
        const resultado = await service.registerUser(email, senha);
        
        // deu certo! manda 201 (created) com sucesso true
        res.status(201).json({ sucesso: true, ...resultado });
    } catch (error: any) {
        console.error("Erro no cadastro:", error.message);
        
        // se o email já tá cadastrado, manda 409 (conflict)
        if (error.message === "Email já cadastrado") {
            return res.status(409).json({ sucesso: false, message: error.message });
        }
        
        // qualquer outro erro vira 500 (erro interno)
        res.status(500).json({ sucesso: false, message: "Erro ao cadastrar usuário" });
    }
};

// lista todo mundo que tá no banco
export const listar = async (req: Request, res: Response) => {
    try {
        const users = await service.listUsers();
        res.json({ sucesso: true, data: users }); // manda a lista
    } catch (error) {
        console.error("Erro ao listar:", error);
        res.status(500).json({ sucesso: false, message: "Erro ao listar usuários" });
    }
};

// busca um usuário específico pelo id que veio na URL (ex: /listar/3)
export const listarPorId = async (req: Request, res: Response) => {
    try {
        // o id vem como string na URL, então converte pra número
        const id = Number(req.params.id);
        const user = await service.findUserById(id);
        res.json({ sucesso: true, data: user });
    } catch (error: any) {
        // se não achou ninguém com esse id, manda 404
        if (error.message === "Usuário não encontrado") {
            return res.status(404).json({ sucesso: false, message: error.message });
        }
        res.status(500).json({ sucesso: false, message: "Erro ao listar usuário" });
    }
};

// rota de login — verifica email e senha e devolve um token JWT
export const login = async (req: Request, res: Response) => {
    try {
        // pega as credenciais (já validadas pelo middleware)
        const { email, senha } = req.body;
        const resultado = await service.login(email, senha);
        res.json(resultado); // manda o token se deu certo
    } catch (error: any) {
        console.error("Erro no login:", error);
        res.status(500).json({ sucesso: false, message: "Erro ao fazer login" });
    }
};

// deleta um usuário pelo id
export const deletar = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        await service.removeUser(id);
        res.json({ sucesso: true, message: "Usuário deletado com sucesso!" });
    } catch (error: any) {
        // se não achou o usuário pra deletar, manda 404
        if (error.message === "Usuário não encontrado") {
            return res.status(404).json({ sucesso: false, message: error.message });
        }
        res.status(500).json({ sucesso: false, message: "Erro ao deletar usuário" });
    }
};

// atualiza email e/ou senha de um usuário
export const atualizar = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id);
        
        // valida o body com o schema do zod — só aceita email e/ou senha
        const { email, senha } = updateUserScheme.parse(req.body);

        // se não mandou nenhum campo, não tem o que atualizar
        if (!email && !senha) {
            return res.status(400).json({
                sucesso: false,
                message: "Pelo menos um campo (email ou senha) deve ser fornecido"
            });
        }

        // o "!" no final força o TypeScript a acreditar que não é undefined
        await service.editUser(id, email!, senha!);
        res.json({ sucesso: true, message: "Usuário atualizado com sucesso!" });
    } catch (error: any) {
        // erro de validação do zod
        if (error.name === "ZodError") {
            return res.status(400).json({
                sucesso: false,
                message: error.errors[0]?.message || "Dados inválidos"
            });
        }
        if (error.message === "Usuário não encontrado") {
            return res.status(404).json({ sucesso: false, message: error.message });
        }
        res.status(500).json({ sucesso: false, message: "Erro ao atualizar usuário" });
    }
};