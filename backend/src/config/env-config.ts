import dotenv from "dotenv";

dotenv.config();

// Note que mudei para JWT_SECRET (tudo maiúsculo)
export const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, JWT_SECRET,JWT_EXPIRES_IN} = process.env;

if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET não configurado no .env!");
    process.exit(1);
}