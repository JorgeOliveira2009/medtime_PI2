import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { usuarioRepository } from "../repositories/user-repositories";
import { Usuario } from "../models/user";
import { JWT_SECRET } from "../config/env-config";

// CADASTRO — cria um novo usuário no banco
export const registerUser = async (email: string, senha: string) => {
    // antes de criar, verifica se esse email já existe
    const existingUser = await usuarioRepository.buscarPorEmail(email);
    if (existingUser) {
        throw new Error("Email já cadastrado"); // lança erro pro controller tratar
    }

    // nunca salva senha pura no banco — gera um hash bcrypt
    // o 10 é o "salt rounds" — quanto maior, mais seguro (e mais lento)
    const hash = await bcrypt.hash(senha, 10);
    console.log("🔐 Hash gerado para:", email);

    // cria o objeto usuário e salva no banco
    const novoUsuario = new Usuario();
    novoUsuario.email = email;
    novoUsuario.senha = hash; // salva o hash, não a senha original

    await usuarioRepository.criar(novoUsuario);

    return { message: "Usuário criado com sucesso" };
};

// LISTAR TODOS — sem filtro, pega todo mundo
export const listUsers = async () => {
    return await usuarioRepository.buscarTodos();
};

// BUSCAR POR ID — lança erro se não achar (o controller transforma em 404)
export const findUserById = async (id: number) => {
    const user = await usuarioRepository.buscarPorId(id);
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    return user;
};

// LOGIN — verifica credenciais e devolve token JWT se tudo certo
export const login = async (email: string, senha: string) => {
    // primeiro acha o usuário pelo email
    const user = await usuarioRepository.buscarPorEmail(email);

    // email não existe no banco
    if (!user) {
        return { sucesso: false, message: "Email não encontrado" };
    }

    // compara a senha digitada com o hash salvo no banco
    // o bcrypt faz isso automaticamente, sem precisar descriptografar
    const senhaValida = await bcrypt.compare(senha, user.senha);

    // senha errada
    if (!senhaValida) {
        return { sucesso: false, message: "Senha incorreta" };
    }

    if (!JWT_SECRET) {
        throw new Error("JWT_SECRET não configurado");
    }

    // gera o token JWT com os dados do usuário no payload
    // expira em 24h — depois disso precisa logar de novo
    const token = jwt.sign(
        { id: user.id, email: user.email }, // payload (o que fica dentro do token)
        JWT_SECRET,                          // chave secreta pra assinar
        { expiresIn: "24h" }                 // tempo de expiração
    );

    return {
        sucesso: true,
        token,
        user: {
            id: user.id,
            email: user.email // não manda a senha de volta, nem o hash
        }
    };
};

// DELETAR — usa o findUserById pra garantir que existe antes de deletar
export const removeUser = async (id: number) => {
    const user = await findUserById(id); // já lança erro se não achar
    if (!user) {
        throw new Error("Usuário não encontrado");
    }
    await usuarioRepository.deletar(id);
    return { message: "Usuário deletado com sucesso" };
};

// ATUALIZAR — gera novo hash se a senha mudou
export const editUser = async (id: number, email: string, senha: string) => {
    const user = await findUserById(id); // já lança erro se não achar
    if (!user) {
        throw new Error("Usuário não encontrado");
    }

    // sempre gera um novo hash pra nova senha
    const hash = await bcrypt.hash(senha, 10);
    user.email = email;
    user.senha = hash; // substitui pelo novo hash

    await usuarioRepository.atualizar(user);
    return { message: "Usuário atualizado com sucesso" };
};