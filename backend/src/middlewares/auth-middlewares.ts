import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env-config";

// Extende o tipo Request do Express pra incluir os dados do usuário logado
// Assim a gente consegue acessar req.user nos controllers das rotas protegidas
export interface AuthRequest extends Request {
  user?: {
    id: number;
    email: string;
    nome: string;
  };
}

// Middleware que protege as rotas — roda antes do controller
// Ele checa se o token JWT veio no cabeçalho e se é válido
export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization; // pega o cabeçalho "Authorization" da requisição
    
    if (!authHeader) {
      // requisição chegou sem nenhum token
      return res.status(401).json({
        sucesso: false,
        message: "Token não fornecido"
      });
    }

    // o token vem no formato "Bearer SEU_TOKEN_AQUI"
    // o split(" ")[1] pega só a parte depois de "Bearer "
    const token = authHeader.split(" ")[1];
    
    if (!token) {
      // o cabeçalho existia mas estava mal formatado (só tinha "Bearer" sem o token)
      return res.status(401).json({
        sucesso: false,
        message: "Token mal formatado"
      });
    }

    if (!JWT_SECRET) {
      // segurança extra — não deveria acontecer porque o env-config já verifica isso na inicialização
      console.error("❌ JWT_SECRET não configurado!");
      return res.status(500).json({
        sucesso: false,
        message: "Erro interno na autenticação"
      });
    }

    // verifica a assinatura do token e decodifica as informações dentro dele
    const decoded = jwt.verify(token, JWT_SECRET) as { 
      id: number; 
      email: string;
      nome: string;
    };
    
    // coloca os dados do usuário no req pra o controller poder usar
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nome: decoded.nome
    };
    
    next(); // token válido! deixa passar pro controller
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      // token existia e era válido, mas o prazo de 7 dias passou
      return res.status(401).json({
        sucesso: false,
        message: "Token expirado, faça login novamente"
      });
    }
    
    // qualquer outro problema com o token (adulterado, chave errada, etc)
    return res.status(401).json({
      sucesso: false,
      message: "Token inválido"
    });
  }
};