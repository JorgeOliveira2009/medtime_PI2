import bcrypt from "bcrypt";
// bcrypt é a biblioteca que transforma senhas em hash
// hash é uma string embaralhada que não dá pra reverter pra senha original

import jwt from "jsonwebtoken";
// jwt (JSON Web Token) é o sistema de autenticação
// gera um "cartão de acesso" com os dados do usuário dentro

import { usuarioRepository } from "../repositories/user-repositories";
import { Usuario } from "../models/user";
import { JWT_SECRET } from "../config/env-config";
// JWT_SECRET é a chave secreta usada pra assinar o token
// fica em variável de ambiente (.env) — nunca hardcoded no código

// ==================== CADASTRO ====================
export const registerUser = async (email: string, senha: string, nome: string) => {
    const existingUser = await usuarioRepository.buscarPorEmail(email);
    if (existingUser) {
        throw new Error("Email já cadastrado");
        // barra antes de tentar salvar — evita duplicata no banco
    }

    const hash = await bcrypt.hash(senha, 10);
    // transforma "minhasenha123" em algo tipo "$2b$10$Kx8zL..."
    // o 10 é o salt rounds — quantas vezes o algoritmo roda
    // quanto maior, mais seguro e mais lento (10 é o padrão recomendado)

    console.log("🔐 Hash gerado para:", email);

    const novoUsuario = new Usuario();
    novoUsuario.nome = nome;
    novoUsuario.email = email;
    novoUsuario.senha = hash;
    // salva o hash, nunca a senha original

    const userSalvo = await usuarioRepository.criar(novoUsuario);

    return {
        user: {
            id: userSalvo.id,
            nome: userSalvo.nome,
            email: userSalvo.email,
            createdAt: userSalvo.createdAt
            // repara: "senha" não tá aqui — nunca retorna o hash pro front
        },
        message: "Usuário criado com sucesso"
    };
};

// ==================== LISTAR TODOS ====================
export const listUsers = async () => {
    const users = await usuarioRepository.buscarTodos();
    return users.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt
        // .map() em cada usuário filtrando a senha fora do retorno
    }));
};

// ==================== BUSCAR POR ID ====================
export const findUserById = async (id: number) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
        // o controller captura esse erro e manda 404
    }
    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt
        // senha fora aqui também
    };
};

// ==================== LOGIN ====================
export const login = async (email: string, senha: string) => {
    const user = await usuarioRepository.buscarPorEmail(email);

    if (!user) {
        throw new Error("Email ou senha inválidos");
        // mensagem genérica de propósito — não fala se o email existe ou não
        // se falasse "email não encontrado", um atacante saberia quais emails
        // estão cadastrados no sistema só de testar
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    // compara a senha digitada com o hash do banco
    // o bcrypt sabe fazer isso sem precisar "desembaralhar" o hash
    if (!senhaValida) {
        throw new Error("Email ou senha inválidos");
        // mesma mensagem do de cima — mesma razão
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado");
        // segurança: se a variável de ambiente não tá configurada, para tudo
        // não deixa gerar token com chave vazia
    }

    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            nome: user.nome
            // esses dados ficam "dentro" do token — o authMiddleware lê daqui
            // por isso req.user.id funciona depois de autenticado
        },
        JWT_SECRET,
        // JWT_SECRET é a assinatura — garante que o token não foi adulterado
        { expiresIn: "7d" }
        // token dura 7 dias — depois precisa logar de novo
    );

    return {
        token,
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email
            // sem senha no retorno
        }
    };
};

// ==================== DELETAR ====================
export const removeUser = async (id: number) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    await usuarioRepository.deletar(id);
    return { message: "Conta deletada com sucesso" };
};

// ==================== ATUALIZAR ====================
export const editUser = async (id: number, email?: string, senha?: string, nome?: string) => {
    // os "?" nos parâmetros = todos opcionais, manda só o que quer mudar

    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (senha) {
        user.senha = await bcrypt.hash(senha, 10);
        // nova senha também vira hash antes de salvar
        // nunca salva senha pura, nem na atualização
    }
    // campos que não vieram ficam como estavam — atualização parcial

    const userAtualizado = await usuarioRepository.atualizar(user);
    
    return {
        user: {
            id: userAtualizado.id,
            nome: userAtualizado.nome,
            email: userAtualizado.email,
            updatedAt: userAtualizado.updatedAt
            // updatedAt ao invés de createdAt — faz sentido mostrar quando atualizou
        },
        message: "Dados atualizados com sucesso"
    };
};