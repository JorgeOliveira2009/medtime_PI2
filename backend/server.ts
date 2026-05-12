import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user-routes";
import { errorMiddleware, notFoundMiddleware } from "./src/middlewares/errors-middlewares";
import { testConnection } from "./src/config/database";
import { DB_HOST, DB_DATABASE, JWT_SECRET } from "./src/config/env-config";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use("/", userRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "API MedTime rodando!",
    status: "online",
    database: DB_DATABASE
  });
});

// Middlewares de erro
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});