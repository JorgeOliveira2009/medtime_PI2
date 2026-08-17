import dotenv from "dotenv";
dotenv.config(); // carrega as variáveis do arquivo .env pra dentro do process.env

// Exporta cada variável separada pra usar em outros arquivos
// É mais organizado do que ficar chamando process.env.ISSO_E_AQUILO por todo o código
export const DB_HOST = process.env.DB_HOST;
export const DB_DATABASE = process.env.DB_DATABASE;
export const DB_PORT = process.env.DB_PORT || "3306"; // se não tiver no .env, usa 3306 como padrão
export const DB_USER = process.env.DB_USER;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const JWT_SECRET = process.env.JWT_SECRET; // chave secreta usada pra assinar os tokens de login

// Verifica se o JWT_SECRET existe — sem ele o login não funciona
// Se não tiver, encerra o servidor antes mesmo de abrir
if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET não configurado no .env!");
    process.exit(1); // mata o processo com código de erro
}