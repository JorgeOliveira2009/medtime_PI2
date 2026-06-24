import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user-routes";
import { errorMiddleware, notFoundMiddleware } from "./src/middlewares/errors-middlewares";
import { AppDataSource } from "./src/config/database";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", userRoutes);

const port = 3000;

// Middlewares de erro
app.use(errorMiddleware);

AppDataSource.initialize()
    .then(() => {
        console.log("✅ Conectado ao banco!");
        app.use("/user", userRoutes);
        app.listen(port, () => console.log(`🚀 Servidor rodando: http://localhost:${port}`));
    })
    .catch((error) => console.error("❌ Erro:", error));