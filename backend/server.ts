import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import userRoutes from "./src/routes/user-routes";

const app = express();

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("🚀 Servidor rodando em http://localhost:3000");
});