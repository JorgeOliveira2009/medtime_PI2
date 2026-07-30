/**
 * Testes unitários — user-controller.ts
 *
 * Mocka o service inteiro e testa só se o controller
 * chama os métodos certos e retorna os status HTTP corretos.
 */

import { Request, Response } from "express";

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock("../../src/services/user-services");
jest.mock("../../src/schemas/user.schema", () => ({
  createUserScheme: { parse: jest.fn((data) => data) },
  updateUserScheme: { parse: jest.fn((data) => data) },
}));

import * as controller from "../../src/controller/user-controller";
import * as service from "../../src/services/user-services";

const mockService = service as jest.Mocked<typeof service>;

// ── Factory de mocks ───────────────────────────────────────────────────────

function criarMocks(body = {}, params = {}) {
  const req = { body, params } as unknown as Request;
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response;
  return { req, res };
}

// ══════════════════════════════════════════════════════════════════════════
// cadastro
// ══════════════════════════════════════════════════════════════════════════

describe("controller.cadastro", () => {
  it("deve retornar 201 quando cadastro é bem-sucedido", async () => {
    const { req, res } = criarMocks({ email: "jorge@email.com", senha: "senha123" });
    mockService.registerUser.mockResolvedValue({ message: "Usuário criado com sucesso" });

    await controller.cadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true })
    );
  });

  it("deve retornar 409 quando email já existe", async () => {
    const { req, res } = criarMocks({ email: "jorge@email.com", senha: "senha123" });
    mockService.registerUser.mockRejectedValue(new Error("Email já cadastrado"));

    await controller.cadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: false, message: "Email já cadastrado" })
    );
  });

  it("deve retornar 500 em erro inesperado", async () => {
    const { req, res } = criarMocks({ email: "jorge@email.com", senha: "senha123" });
    mockService.registerUser.mockRejectedValue(new Error("Erro de banco"));

    await controller.cadastro(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// listar
// ══════════════════════════════════════════════════════════════════════════

describe("controller.listar", () => {
  it("deve retornar lista de usuários com sucesso", async () => {
    const { req, res } = criarMocks();
    const lista = [{ id: 1, email: "jorge@email.com" }];
    mockService.listUsers.mockResolvedValue(lista as any);

    await controller.listar(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true, data: lista })
    );
  });

  it("deve retornar 500 em caso de erro", async () => {
    const { req, res } = criarMocks();
    mockService.listUsers.mockRejectedValue(new Error("DB offline"));

    await controller.listar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// listarPorId
// ══════════════════════════════════════════════════════════════════════════

describe("controller.listarPorId", () => {
  it("deve retornar usuário quando ID existe", async () => {
    const { req, res } = criarMocks({}, { id: "1" });
    mockService.findUserById.mockResolvedValue({ id: 1, email: "jorge@email.com" } as any);

    await controller.listarPorId(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true })
    );
  });

  it("deve retornar 404 quando usuário não existe", async () => {
    const { req, res } = criarMocks({}, { id: "999" });
    mockService.findUserById.mockRejectedValue(new Error("Usuário não encontrado"));

    await controller.listarPorId(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// login
// ══════════════════════════════════════════════════════════════════════════

describe("controller.login", () => {
  it("deve retornar token no login bem-sucedido", async () => {
    const { req, res } = criarMocks({ email: "jorge@email.com", senha: "senha123" });
    mockService.login.mockResolvedValue({ sucesso: true, token: "jwt.fake" } as any);

    await controller.login(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true, token: "jwt.fake" })
    );
  });

  it("deve retornar 500 em erro inesperado", async () => {
    const { req, res } = criarMocks({ email: "jorge@email.com", senha: "senha123" });
    mockService.login.mockRejectedValue(new Error("Erro inesperado"));

    await controller.login(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// deletar
// ══════════════════════════════════════════════════════════════════════════

describe("controller.deletar", () => {
  it("deve retornar sucesso ao deletar usuário", async () => {
    const { req, res } = criarMocks({}, { id: "1" });
    mockService.removeUser.mockResolvedValue({ message: "Usuário deletado com sucesso" });

    await controller.deletar(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true })
    );
  });

  it("deve retornar 404 quando usuário não existe", async () => {
    const { req, res } = criarMocks({}, { id: "999" });
    mockService.removeUser.mockRejectedValue(new Error("Usuário não encontrado"));

    await controller.deletar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// atualizar
// ══════════════════════════════════════════════════════════════════════════

describe("controller.atualizar", () => {
  it("deve retornar sucesso ao atualizar usuário", async () => {
    const { req, res } = criarMocks(
      { email: "novo@email.com", senha: "novaSenha123" },
      { id: "1" }
    );
    mockService.editUser.mockResolvedValue({ message: "Usuário atualizado com sucesso" });

    await controller.atualizar(req, res);

    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: true })
    );
  });

  it("deve retornar 400 quando nenhum campo é enviado", async () => {
    const { req, res } = criarMocks({}, { id: "1" });

    // updateUserScheme.parse retorna objeto vazio => nenhum campo
    const { updateUserScheme } = require("../../src/schemas/user.schema");
    updateUserScheme.parse.mockReturnValueOnce({});

    await controller.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ sucesso: false })
    );
  });

  it("deve retornar 404 quando usuário não existe", async () => {
    const { req, res } = criarMocks(
      { email: "novo@email.com", senha: "novaSenha123" },
      { id: "999" }
    );
    mockService.editUser.mockRejectedValue(new Error("Usuário não encontrado"));

    await controller.atualizar(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });
});
