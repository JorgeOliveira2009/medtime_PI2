import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as repo from "../repositories/user-repositories";
import { User } from "../models/user";

// CADASTRO
export const registerUser = async (user: User) => {
  const hash = await bcrypt.hash(user.senha, 10); // 10 é o padrão

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
  return repo.getUserById(id);
};

// LOGIN 🔐
export const login = async (email: string, senha: string) => {
  const users: any = await repo.getUserByEmail(email);

  if (users.length === 0) {
    return { sucesso: false };
  }

  const user = users[0];

  const senhaValida = await bcrypt.compare(senha, user.senha);

  if (!senhaValida) {
    return { sucesso: false };
  }

  // 🎟️ GERAR TOKEN JWT
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET as string,
    { expiresIn: "1h" }
  );

  return {
    sucesso: true,
    token
  };
};

// DELETAR
export const removeUser = async (id: number) => {
  return repo.deleteUser(id);
};

// ATUALIZAR
export const editUser = async (id: number, email: string, senha: string) => {
  const hash = await bcrypt.hash(senha, 10);

  return repo.updateUser(id, email, hash);
};