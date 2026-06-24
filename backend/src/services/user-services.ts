import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usuarioRepository } from "../repositories/user-repositories";
import { Usuario } from "../models/user";
import { JWT_SECRET } from "../config/env-config";

// CADASTRO
export const registerUser = async (email: string, senha: string) => {
    // Verifica se email já existe
    const existingUser = await usuarioRepository.buscarPorEmail(email);
    if (existingUser) {
        throw new Error("Email já cadastrado");
    }

    const hash = await bcrypt.hash(senha, 10);
    console.log("🔐 Hash gerado para:", email);

    const novoUsuario = new Usuario();
    novoUsuario.email = email;
    novoUsuario.senha = hash;

    await usuarioRepository.criar(novoUsuario);

    return { message: "Usuário criado com sucesso" };
};

// LISTAR TODOS
export const listUsers = async () => {
    return await usuarioRepository.buscarTodos();
};

// BUSCAR POR ID
export const findUserById = async (id: number) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    return user;
};

// LOGIN
export const login = async (email: string, senha: string) => {
    const user = await usuarioRepository.buscarPorEmail(email);

    if (!user) {
        return { sucesso: false, message: "Email não encontrado" };
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);

    if (!senhaValida) {
        return { sucesso: false, message: "Senha incorreta" };
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado");
    }

    const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "24h" }
    );

    return {
        sucesso: true,
        token,
        user: {
            id: user.id,
            email: user.email
        }
    };
};

// DELETAR
export const removeUser = async (id: number) => {
    const user = await findUserById(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    await usuarioRepository.deletar(id);
    return { message: "Usuário deletado com sucesso" };
};

// ATUALIZAR
export const editUser = async (id: number, email: string, senha: string) => {
    const user = await findUserById(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    const hash = await bcrypt.hash(senha, 10);
    user.email = email;
    user.senha = hash;

    await usuarioRepository.atualizar(user);
    return { message: "Usuário atualizado com sucesso" };
};