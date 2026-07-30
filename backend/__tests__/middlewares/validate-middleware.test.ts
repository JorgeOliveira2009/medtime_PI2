/**
 * Testes unitários — validate-middleware.ts
 *
 * Verifica se o middleware de validação Zod aceita dados válidos
 * e rejeita dados inválidos com o status correto.
 */

import { Request, Response, NextFunction } from "express";
import { validate } from "../../src/middlewares/validate-middleware";
import { createUserScheme } from "../../src/schemas/user.schema";

function criarMocks(body: object) {
  const req = { body } as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  const next = jest.fn() as NextFunction;
  return { req, res, next };
}

describe("validate middleware", () => {
  const middleware = validate(createUserScheme);

  it("deve chamar next() quando body é válido", async () => {
    const { req, res, next } = criarMocks({
      email: "jorge@email.com",
      senha: "senha123",
    });

    await middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando email é inválido", async () => {
    const { req, res, next } = criarMocks({
      email: "emailinvalido",
      senha: "senha123",
    });

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: false })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 400 quando senha é muito curta", async () => {
    const { req, res, next } = criarMocks({
      email: "jorge@email.com",
      senha: "123",
    });

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: false })
    );
  });

  it("deve retornar 400 quando body está vazio", async () => {
    const { req, res, next } = criarMocks({});

    await middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(next).not.toHaveBeenCalled();
  });
});
