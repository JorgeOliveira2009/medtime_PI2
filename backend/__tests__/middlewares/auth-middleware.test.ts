/**
 * Testes unitários — auth-middlewares.ts
 *
 * Testa as três situações principais: token válido, ausente e inválido/expirado.
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { authMiddleware } from "../../src/middlewares/auth-middlewares";

jest.mock("jsonwebtoken");
jest.mock("../../src/config/env-config", () => ({
  JWT_SECRET: "secret-de-teste",
}));

const mockJwt = jwt as jest.Mocked<typeof jwt>;

// ── Factory de mocks do Express ────────────────────────────────────────────

function criarMocks() {
  const req = {
    headers: {},
  } as unknown as Request;

  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;

  const next = jest.fn() as NextFunction;

  return { req, res, next };
}

// ══════════════════════════════════════════════════════════════════════════
// authMiddleware
// ══════════════════════════════════════════════════════════════════════════

describe("authMiddleware", () => {
  it("deve chamar next() quando token JWT é válido", () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = "Bearer token.valido.aqui";

    (mockJwt.verify as jest.Mock).mockReturnValue({ id: 1, email: "jorge@email.com" });

    authMiddleware(req as any, res, next);

    expect(next).toHaveBeenCalled();
    expect((req as any).user).toEqual({ id: 1, email: "jorge@email.com" });
    expect(res.status).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando header Authorization está ausente", () => {
    const { req, res, next } = criarMocks();
    // sem authorization header

    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: false, message: "Token não fornecido" })
    );
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando header está mal formatado (sem Bearer)", () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = "tokenSemBearer";

    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("deve retornar 401 quando token está expirado", () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = "Bearer token.expirado";

    (mockJwt.verify as jest.Mock).mockImplementation(() => {
      throw new jwt.TokenExpiredError("jwt expired", new Date());
    });

    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Token expirado, faça login novamente" })
    );
  });

  it("deve retornar 401 quando token é inválido", () => {
    const { req, res, next } = criarMocks();
    req.headers.authorization = "Bearer token.invalido";

    (mockJwt.verify as jest.Mock).mockImplementation(() => {
      throw new jwt.JsonWebTokenError("invalid token");
    });

    authMiddleware(req as any, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ message: "Token inválido" })
    );
  });
});
