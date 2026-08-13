import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env-config";

// extende o Request do Express pra guardar os dados do usuário logado
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
  };
}

export class Authmiddle {
  // método estático = não precisa instanciar a classe pra usar
  static verificarToken(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      // pega o header Authorization da requisição
      const authHeader = req.headers.authorization;
      
      // se não veio nenhum header, barra na porta
      if (!authHeader) {
        return res.status(401).json({
          sucesso: false,
          message: "Token não fornecido"
        });
      }

      // o header vem assim: "Bearer eyJhbG..."
      // o split(" ")[1] pega só a parte depois do "Bearer "
      const token = authHeader.split(" ")[1];
      
      // se veio "Bearer" mas sem token depois, também barra
      if (!token) {
        return res.status(401).json({
          sucesso: false,
          message: "Token mal formatado"
        });
      }

      // garante que o JWT_SECRET tá configurado no .env
      if (!JWT_SECRET) {
        console.error("❌ JWT_SECRET não configurado!");
        return res.status(500).json({
          sucesso: false,
          message: "Erro interno na autenticação"
        });
      }

      // verifica se o token é válido e decodifica o payload
      const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
      
      // salva os dados do usuário no req pra usar nos controllers
      req.user = {
        id: decoded.id,
        email: decoded.email
      };
      
      // tudo certo, passa pra próxima função
      next();
    } catch (error) {
      // token expirou (passou das 24h)
      if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({
          sucesso: false,
          message: "Token expirado, faça login novamente"
        });
      }
      
      // token inválido (adulterado ou gerado com secret errado)
      return res.status(401).json({
        sucesso: false,
        message: "Token inválido"
      });
    }
  }
}

// exporta direto como função pra usar nas rotas sem precisar chamar Authmiddle.verificarToken
export const authMiddleware = Authmiddle.verificarToken;