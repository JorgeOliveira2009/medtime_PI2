import dotenv from "dotenv";

dotenv.config();


// Note que mudei para JWT_SECRET (tudo maiúsculo)
export const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_DATABASE, JWT_SECRET, JWT_EXPIRES_IN, OCR_SPACE_API_KEY } = process.env;

if (!JWT_SECRET) {
    console.error("❌ JWT_SECRET não configurado no .env!");
    process.exit(1);
}

if (!OCR_SPACE_API_KEY) {
    console.warn("⚠️  OCR_SPACE_API_KEY não configurada — o scanner de receita vai falhar");
}