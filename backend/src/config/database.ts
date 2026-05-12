import mysql from "mysql2/promise";
import { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASSWORD } from "./env-config";

console.log("🔌 Conectando ao banco:", {
  host: DB_HOST,
  database: DB_DATABASE,
  user: DB_USER,
  port: DB_PORT
});

export const pool = mysql.createPool({
  host: DB_HOST || "localhost",
  port: Number(DB_PORT) || 3306,
  user: DB_USER || "root",
  password: DB_PASSWORD || "",
  database: DB_DATABASE || "medtime",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testa conexão
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Banco conectado com sucesso!");
    connection.release();
    return true;
  } catch (error) {
    console.error("❌ Erro ao conectar no banco:", error);
    return false;
  }
};