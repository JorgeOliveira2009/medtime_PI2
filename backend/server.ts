import dotenv from "dotenv";
dotenv.config(); // carrega o .env antes de tudo — precisa ser o primeiro import!
import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./src/routes/user-routes";
import { errorMiddleware, notFoundMiddleware } from "./src/middlewares/errors-middlewares";
import { AppDataSource } from "./src/config/database";
import { swaggerSpec } from "./src/config/swagger";

const app = express();

app.use(cors());                                  // permite que o app mobile/web acesse a API
app.use(express.json());                          // faz o express entender JSON no body das requisições
app.use(express.urlencoded({ extended: true }));  // faz o express entender formulários também

// rota da documentação visual da API (tipo um Postman no navegador)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// todas as rotas de usuário ficam agrupadas em /user (ex: /user/login, /user/cadastro)
app.use("/user", userRoutes);

// middleware de 404 — precisa vir depois das rotas pra só rodar quando nenhuma casou
app.use(notFoundMiddleware);

// middleware de erro global — precisa ser sempre o último
app.use(errorMiddleware);

const port = 3000;

// primeiro conecta ao banco, só depois liga o servidor
// faz sentido porque sem banco a API não funciona de nada
AppDataSource.initialize()
    .then(() => {
        console.log("✅ Conectado ao banco!");
        app.listen(port, "0.0.0.0", () => {
            console.log(`🚀 Servidor rodando na porta ${port}`);
            console.log(`📚 Docs Swagger: http://localhost:${port}/api-docs`);
        });
    })
    .catch((error) => console.error("❌ Erro:", error));