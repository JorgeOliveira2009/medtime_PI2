import { Request, Response, NextFunction } from "express";

// Interface para erro personalizado
export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

// Middleware de erro global
export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("❌ Erro capturado:", {
    message: error.message,
    stack: error.stack,
    code: error.code,
    path: req.path,
    method: req.method
  });

  // Erros específicos do MySQL
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      sucesso: false,
      message: "Email já cadastrado no sistema"
    });
  }

  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      sucesso: false,
      message: "Referência inválida no banco de dados"
    });
  }

  if (error.code === "ER_BAD_FIELD_ERROR") {
    return res.status(400).json({
      sucesso: false,
      message: "Campo inválido na requisição"
    });
  }

  // Erros de validação personalizados
  if (error.message.includes("validation") || error.message.includes("Validation")) {
    return res.status(400).json({
      sucesso: false,
      message: error.message
    });
  }

  // Erro padrão com statusCode personalizado
  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : "Erro interno do servidor";

  res.status(statusCode).json({
    sucesso: false,
    message: message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};

// Middleware para rotas não encontradas (404)
export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    sucesso: false,
    message: `Rota ${req.method} ${req.path} não encontrada`
  });
};

// Middleware para validar campos obrigatórios
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    
    for (const field of fields) {
      if (!req.body[field] && req.body[field] !== 0) {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        sucesso: false,
        message: `Campos obrigatórios faltando: ${missingFields.join(", ")}`
      });
    }
    
    next();
  };
};

// Classe para erro personalizado
export class CustomError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statusCode;
  }
}