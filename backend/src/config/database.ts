import "reflect-metadata";
import { DataSource } from "typeorm";
import { Usuario } from "../models/user";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "root",
    database: "medtime",
    synchronize: true,
    logging: true,
    entities: [Usuario],
});

