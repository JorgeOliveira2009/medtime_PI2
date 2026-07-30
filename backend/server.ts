import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import userRoutes from "./src/routes/user-routes";
import { errorMiddleware, notFoundMiddleware } from "./src/middlewares/errors-middlewares";
import { AppDataSource } from "./src/config/database";
import { swaggerSpec } from "./src/config/swagger";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Documentação Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/user", userRoutes);

// 404 (precisa vir depois das rotas)
app.use(notFoundMiddleware);

// Middleware de erro (sempre por último)
app.use(errorMiddleware);

const port = 3000;

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Conectado ao banco!");
       app.listen(port, "0.0.0.0", () => {
    console.log(`🚀 Servidor rodando na porta ${port}`);
    console.log(`📚 Docs Swagger: http://localhost:${port}/api-docs`);
});
    })
    .catch((error) => console.error("❌ Erro:", error));