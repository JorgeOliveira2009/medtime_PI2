import { Request, Response, NextFunction } from "express";

// interface que extende o Error padrão com campos extras que o Express usa
export interface AppError extends Error {
  statusCode?: number;
  code?: string; // código de erro do MySQL (ex: ER_DUP_ENTRY)
}

// middleware global de erros — captura qualquer erro que não foi tratado antes
// obs: precisa de 4 parâmetros pra o Express reconhecer como middleware de erro
export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // loga o erro no terminal pra facilitar o debug
  console.error("❌ Erro capturado:", {
    message: error.message,
    stack: error.stack,
    code: error.code,
    path: req.path,
    method: req.method
  });

  // email duplicado no banco (unique constraint do MySQL)
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      sucesso: false,
      message: "Email já cadastrado no sistema"
    });
  }

  // tentou referenciar uma linha que não existe em outra tabela (foreign key)
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      sucesso: false,
      message: "Referência inválida no banco de dados"
    });
  }

  // nome de coluna errado na query
  if (error.code === "ER_BAD_FIELD_ERROR") {
    return res.status(400).json({
      sucesso: false,
      message: "Campo inválido na requisição"
    });
  }

  // erro de validação genérico
  if (error.message.includes("validation") || error.message.includes("Validation")) {
    return res.status(400).json({
      sucesso: false,
      message: error.message
    });
  }

  // erro com statusCode customizado (ex: CustomError lá embaixo)
  const statusCode = error.statusCode || 500;
  const message = error.statusCode ? error.message : "Erro interno do servidor";

  res.status(statusCode).json({
    sucesso: false,
    message: message,
    // em desenvolvimento mostra o stack trace pra ajudar a debugar
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};

// middleware de 404 — roda quando nenhuma rota casou com a requisição
export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    sucesso: false,
    message: `Rota ${req.method} ${req.path} não encontrada`
  });
};

// factory de middleware — retorna uma função que valida campos obrigatórios no body
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    
    // percorre a lista de campos e vê quais estão faltando
    for (const field of fields) {
      // o "!== 0" é pra não barrar campo com valor 0 (que é válido)
      if (!req.body[field] && req.body[field] !== 0) {
        missingFields.push(field);
      }
    }
    
    // se faltou algum campo, avisa quais foram
    if (missingFields.length > 0) {
      return res.status(400).json({
        sucesso: false,
        message: `Campos obrigatórios faltando: ${missingFields.join(", ")}`
      });
    }
    
    next();
  };
};

// classe de erro customizado — pra lançar erros com status HTTP específico
export class CustomError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message); // chama o constructor do Error padrão
    this.name = "CustomError";
    this.statusCode = statusCode;
  }
}