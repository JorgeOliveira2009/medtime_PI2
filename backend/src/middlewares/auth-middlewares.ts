import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env-config"; // 👈 importa daqui

export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export class Authmiddle {
  static verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader) {
        return res.status(401).json({
          sucesso: false,
          message: "Token não fornecido"
        });
      }

      const token = authHeader.split(" ")[1];
      
      if (!token) {
        return res.status(401).json({
          sucesso: false,
          message: "Token mal formatado"
        });
      }

      // Verifica se o JWT_SECRET existe
      if (!JWT_SECRET) {
        console.error("❌ JWT_SECRET não configurado!");
        return res.status(500).json({
          sucesso: false,
          message: "Erro interno na autenticação"
        });
      }

      // Verifica o token usando o JWT_SECRET
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
      
      next();
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          sucesso: false,
          message: "Token expirado, faça login novamente"
        });
      }
      
      return res.status(401).json({
        sucesso: false,
        message: "Token inválido"
      });
    }
  }
}

// Exporta função direta
export const authMiddleware = Authmiddle.verificarToken;