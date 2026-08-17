import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../models/user";
import { DB_HOST, DB_DATABASE, DB_PORT, DB_USER, DB_PASSWORD } from "./env-config";

// Aqui a gente configura a conexão com o banco de dados MySQL
// É tipo preencher um formulário dizendo "qual banco, qual usuário, qual senha"
export const AppDataSource = new DataSource({
    type: "mysql",                        // tipo do banco que estamos usando
    host: DB_HOST || "localhost",         // endereço do banco (se não tiver no .env, usa o computador local)
    port: Number(DB_PORT) || 3306,        // porta padrão do MySQL é 3306
    username: DB_USER || "root",          // usuário do banco
    password: DB_PASSWORD || "",          // senha do banco
    database: DB_DATABASE || "medtime",   // nome do banco de dados
    synchronize: true, // isso cria/atualiza as tabelas automaticamente — CUIDADO: em produção coloca false pra não perder dados!
    logging: true,                        // mostra no terminal todas as queries SQL que rodam
    entities: [Usuario],                  // lista de "tabelas" que o sistema vai gerenciar
});