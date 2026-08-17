import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usuarioRepository } from "../repositories/user-repositories";
import { Usuario } from "../models/user";
import { JWT_SECRET } from "../config/env-config";

// CADASTRO — cria um novo usuário no banco
export const registerUser = async (email: string, senha: string, nome: string) => {
    // verifica se o email já está em uso antes de tentar cadastrar
    const existingUser = await usuarioRepository.buscarPorEmail(email);
    if (existingUser) {
        throw new Error("Email já cadastrado");
    }

    // transforma a senha em um hash — nunca salvamos senha em texto puro!
    // o 10 é o "custo" do hash: quanto maior, mais seguro mas mais lento
    const hash = await bcrypt.hash(senha, 10);
    console.log("🔐 Hash gerado para:", email);

    // monta o objeto do usuário com os dados e o hash da senha
    const novoUsuario = new Usuario();
    novoUsuario.nome = nome;
    novoUsuario.email = email;
    novoUsuario.senha = hash;

    const userSalvo = await usuarioRepository.criar(novoUsuario);

    // retorna só os dados necessários, sem expor o hash da senha
    return {
        user: {
            id: userSalvo.id,
            nome: userSalvo.nome,
            email: userSalvo.email,
            createdAt: userSalvo.createdAt
        },
        message: "Usuário criado com sucesso"
    };
};

// LISTAR TODOS — busca todos os usuários e filtra o que vai na resposta
export const listUsers = async () => {
    const users = await usuarioRepository.buscarTodos();
    // o .map transforma cada usuário, removendo a senha do retorno
    return users.map(user => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt
    }));
};

// BUSCAR POR ID — retorna os dados de um usuário específico
export const findUserById = async (id: number) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado"); // o controller vai capturar esse erro
    }
    return {
        id: user.id,
        nome: user.nome,
        email: user.email,
        createdAt: user.createdAt
    };
};

// LOGIN — verifica o email, compara a senha e gera o token JWT
export const login = async (email: string, senha: string) => {
    const user = await usuarioRepository.buscarPorEmail(email);

    if (!user) {
        // usamos a mesma mensagem pra email e senha inválidos de propósito
        // assim não entregamos se o email existe ou não no sistema (segurança)
        throw new Error("Email ou senha inválidos");
    }

    // compara a senha digitada com o hash salvo no banco
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
        throw new Error("Email ou senha inválidos");
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado");
    }

    // cria o token JWT com os dados do usuário dentro
    // o token vai ser usado nas próximas requisições pra identificar quem está logado
    const token = jwt.sign(
        { 
            id: user.id, 
            email: user.email,
            nome: user.nome 
        },
        JWT_SECRET,
        { expiresIn: "7d" } // o token expira em 7 dias — aí precisa fazer login de novo
    );

    return {
        token,
        user: {
            id: user.id,
            nome: user.nome,
            email: user.email
        }
    };
};

// DELETAR — remove a conta do banco pelo id
export const removeUser = async (id: number) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    await usuarioRepository.deletar(id);
    return { message: "Conta deletada com sucesso" };
};

// ATUALIZAR — muda só os campos que foram enviados, mantém o resto igual
export const editUser = async (id: number, email?: string, senha?: string, nome?: string) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // só atualiza o campo se ele veio na requisição
    if (nome) user.nome = nome;
    if (email) user.email = email;
    if (senha) {
        // a nova senha também precisa virar hash antes de salvar
        user.senha = await bcrypt.hash(senha, 10);
    }

    const userAtualizado = await usuarioRepository.atualizar(user);
    
    return {
        user: {
            id: userAtualizado.id,
            nome: userAtualizado.nome,
            email: userAtualizado.email,
            updatedAt: userAtualizado.updatedAt
        },
        message: "Dados atualizados com sucesso"
    };
};