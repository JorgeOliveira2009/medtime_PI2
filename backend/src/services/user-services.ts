import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as repo from "../repositories/user-repositories";
import { User } from "../models/user";
import { JWT_SECRET } from "../config/env-config";

// CADASTRO
export const registerUser = async (user: User) => {
  // Verifica se email já existe
  const existingUser = await repo.getUserByEmail(user.email);
  if (existingUser && (existingUser as any[]).length > 0) {
    throw new Error("Email já cadastrado");
  }
  
  const hash = await bcrypt.hash(user.senha, 10);
  console.log("🔐 Hash gerado para:", user.email);
  
  await repo.createUser({
    email: user.email,
    senha: hash
  });
  
  return { message: "Usuário criado com sucesso" };
};

// LISTAR
export const listUsers = async () => {
  return repo.getUsers();
};

// BUSCAR POR ID
export const findUserById = async (id: number) => {
  const users = await repo.getUserById(id);
  const userArray = users as any[];
  
  if (userArray.length === 0) {
    throw new Error("Usuário não encontrado");
  }
  
  return userArray[0];
};

// LOGIN
export const login = async (email: string, senha: string) => {
  const users = await repo.getUserByEmail(email);
  const userArray = users as any[];

  if (userArray.length === 0) {
    return { sucesso: false, message: "Email não encontrado" };
  }

  const user = userArray[0];
  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return { sucesso: false, message: "Senha incorreta" };
  }

  // Gera o token JWT
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
  return repo.deleteUser(id);
};

// ATUALIZAR
export const editUser = async (id: number, email: string, senha: string) => {
  const user = await findUserById(id);
  if (!user) {
    throw new Error("Usuário não encontrado");
  }
  
  const hash = await bcrypt.hash(senha, 10);
  return repo.updateUser(id, email, hash);
};