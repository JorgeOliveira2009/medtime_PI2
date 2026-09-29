import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middlewares";
import * as service from "../services/ocr-services";
import { CustomError } from "../middlewares/errors-middlewares";

export const escanear = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });

        if (!req.file) return res.status(400).json({ sucesso: false, message: "Nenhuma imagem enviada" });

        const resultado = await service.extrairTextoDaImagem(req.file.buffer, req.file.mimetype);

        res.json({ sucesso: true, data: resultado });
    } catch (error: any) {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ sucesso: false, message: error.message });
        }
        res.status(500).json({ sucesso: false, message: "Erro ao escanear imagem" });
    }
};