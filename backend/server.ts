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
import { globalRateLimit } from "./src/middlewares/rate-limit.middlewares";
import remedioRoutes from "./src/routes/remedio-routes";
import ocrRoutes from "./src/routes/ocr-routes"; // ← novo

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalRateLimit);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/user", userRoutes);
app.use("/remedio", remedioRoutes);
app.use("/ocr", ocrRoutes); // ← novo

app.use(notFoundMiddleware);
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