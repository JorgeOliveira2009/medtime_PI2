import { pool } from "../config/database";
import { User } from "../models/user";

// CRIAR
export const createUser = async (user: User) => {
  await pool.query(
    "INSERT INTO usuarios (email, senha) VALUES (?, ?)",
    [user.email, user.senha]
  );
};

// LISTAR TODOS
export const getUsers = async () => {
  const [rows] = await pool.query("SELECT * FROM usuarios");
  return rows;
};

// BUSCAR POR ID
export const getUserById = async (id: number) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE id = ?",
    [id]
  );
  return rows;
};

// 🔑 BUSCAR POR EMAIL (SUBSTITUI loginUser)
export const getUserByEmail = async (email: string) => {
  const [rows] = await pool.query(
    "SELECT * FROM usuarios WHERE email = ?",
    [email]
  );
  return rows;
};

// DELETAR
export const deleteUser = async (id: number) => {
  await pool.query("DELETE FROM usuarios WHERE id = ?", [id]);
};

// ATUALIZAR
export const updateUser = async (id: number, email: string, senha: string) => {
  await pool.query(
    "UPDATE usuarios SET email = ?, senha = ? WHERE id = ?",
    [email, senha, id]
  );
};