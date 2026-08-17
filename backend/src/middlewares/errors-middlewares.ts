import { Request, Response, NextFunction } from "express";

// Extende o Error padrão do JavaScript com campos extras que o Express e o MySQL usam
export interface AppError extends Error {
  statusCode?: number;
  code?: string; // código de erro do MySQL (ex: ER_DUP_ENTRY = email duplicado)
}

// Middleware global de erros — captura qualquer erro que chegou sem tratamento
// Precisa ter exatamente 4 parâmetros (error, req, res, next) pra o Express reconhecer como middleware de erro
export const errorMiddleware = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // mostra o erro completo no terminal pra facilitar o debug durante o desenvolvimento
  console.error("❌ Erro capturado:", {
    message: error.message,
    stack: error.stack,   // rastro de onde o erro aconteceu no código
    code: error.code,     // código de erro do MySQL (se tiver)
    path: req.path,       // qual rota foi chamada
    method: req.method    // GET, POST, PUT, DELETE...
  });

  // email que já existe no banco (restrição "unique" do MySQL foi violada)
  if (error.code === "ER_DUP_ENTRY") {
    return res.status(409).json({
      sucesso: false,
      message: "Email já cadastrado no sistema"
    });
  }

  // tentou referenciar uma linha que não existe em outra tabela
  // ex: cadastrar um remédio pra um usuário que não existe
  if (error.code === "ER_NO_REFERENCED_ROW_2") {
    return res.status(400).json({
      sucesso: false,
      message: "Referência inválida no banco de dados"
    });
  }

  // nome de coluna que não existe na tabela foi usado numa query
  if (error.code === "ER_BAD_FIELD_ERROR") {
    return res.status(400).json({
      sucesso: false,
      message: "Campo inválido na requisição"
    });
  }

  // erro de validação de dados genérico
  if (error.message.includes("validation") || error.message.includes("Validation")) {
    return res.status(400).json({
      sucesso: false,
      message: error.message
    });
  }

  // erro com código HTTP customizado (lançado pelo CustomError lá embaixo)
  const statusCode = error.statusCode || 500;
  // se veio um statusCode customizado, usa a mensagem original; senão, esconde o detalhe do erro
  const message = error.statusCode ? error.message : "Erro interno do servidor";

  res.status(statusCode).json({
    sucesso: false,
    message: message,
    // só mostra o stack trace em ambiente de desenvolvimento — em produção não expõe isso
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  });
};

// Middleware de 404 — roda quando nenhuma rota registrada casou com o que foi pedido
export const notFoundMiddleware = (req: Request, res: Response) => {
  res.status(404).json({
    sucesso: false,
    message: `Rota ${req.method} ${req.path} não encontrada`
  });
};

// Função que cria um middleware de validação de campos obrigatórios
// Recebe uma lista de campos e devolve um middleware pronto pra usar em qualquer rota
export const validateRequiredFields = (fields: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const missingFields: string[] = [];
    
    // percorre a lista e verifica se cada campo existe no body da requisição
    for (const field of fields) {
      // o "!== 0" é pra não barrar o campo quando o valor for zero (0 é válido!)
      if (!req.body[field] && req.body[field] !== 0) {
        missingFields.push(field);
      }
    }
    
    // se algum campo estiver faltando, avisa quais são antes de deixar passar
    if (missingFields.length > 0) {
      return res.status(400).json({
        sucesso: false,
        message: `Campos obrigatórios faltando: ${missingFields.join(", ")}`
      });
    }
    
    next(); // tudo preenchido, pode continuar
  };
};

// Classe de erro com código HTTP embutido
// Útil pra lançar erros específicos de dentro do código sem precisar tratar em cada lugar
export class CustomError extends Error {
  statusCode: number;
  
  constructor(message: string, statusCode: number = 500) {
    super(message); // chama o constructor do Error padrão do JavaScript
    this.name = "CustomError";
    this.statusCode = statusCode; // guarda o código HTTP junto com o erro
  }
}