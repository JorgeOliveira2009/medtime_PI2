/**
 * Testes unitários — user-services.ts
 *
 * Estratégia: mockar o repositório e o bcrypt/jwt para isolar
 * a lógica de negócio pura, sem tocar no banco de dados.
 */

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ── Mocks ──────────────────────────────────────────────────────────────────

// Mock do repositório — intercepta ANTES de importar o service
jest.mock("../../src/repositories/user-repositories", () => ({
  usuarioRepository: {
    buscarPorEmail: jest.fn(),
    buscarPorId: jest.fn(),
    buscarTodos: jest.fn(),
    criar: jest.fn(),
    atualizar: jest.fn(),
    deletar: jest.fn(),
  },
}));

jest.mock("bcrypt");
jest.mock("jsonwebtoken");

// Mock do env para JWT_SECRET
jest.mock("../../src/config/env-config", () => ({
  JWT_SECRET: "secret-de-teste",
}));

// ── Imports (depois dos mocks) ─────────────────────────────────────────────

import { usuarioRepository } from "../../src/repositories/user-repositories";
import * as service from "../../src/services/user-services";

// Cast para deixar o TypeScript feliz com os mocks
const mockRepo = usuarioRepository as jest.Mocked<typeof usuarioRepository>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwt as jest.Mocked<typeof jwt>;

// Limpa todos os mocks antes de cada teste
beforeEach(() => {
  jest.resetAllMocks();
});


// ── Helpers ────────────────────────────────────────────────────────────────

const usuarioFake = { id: 1, email: "jorge@email.com", senha: "hashFake" };

// ══════════════════════════════════════════════════════════════════════════
// registerUser
// ══════════════════════════════════════════════════════════════════════════

describe("registerUser", () => {
  it("deve criar usuário com sucesso quando email não existe", async () => {
    mockRepo.buscarPorEmail.mockResolvedValue(null);
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("hashGerado");
    mockRepo.criar.mockResolvedValue(usuarioFake as any);

    const resultado = await service.registerUser("jorge@email.com", "senha123");

    expect(mockRepo.buscarPorEmail).toHaveBeenCalledWith("jorge@email.com");
    expect(mockBcrypt.hash).toHaveBeenCalledWith("senha123", 10);
    expect(mockRepo.criar).toHaveBeenCalled();
    expect(resultado).toEqual({ message: "Usuário criado com sucesso" });
  });

  it("deve lançar erro quando email já está cadastrado", async () => {
    mockRepo.buscarPorEmail.mockResolvedValue(usuarioFake as any);

    await expect(
      service.registerUser("jorge@email.com", "senha123")
    ).rejects.toThrow("Email já cadastrado");

    expect(mockRepo.criar).not.toHaveBeenCalled();
  });
});

// ══════════════════════════════════════════════════════════════════════════
// listUsers
// ══════════════════════════════════════════════════════════════════════════

describe("listUsers", () => {
  it("deve retornar lista de usuários", async () => {
    const lista = [usuarioFake, { id: 2, email: "outro@email.com", senha: "hash2" }];
    mockRepo.buscarTodos.mockResolvedValue(lista as any);

    const resultado = await service.listUsers();

    expect(resultado).toHaveLength(2);
    expect(resultado[0].email).toBe("jorge@email.com");
  });

  it("deve retornar lista vazia quando não há usuários", async () => {
    mockRepo.buscarTodos.mockResolvedValue([]);

    const resultado = await service.listUsers();

    expect(resultado).toEqual([]);
  });
});

// ══════════════════════════════════════════════════════════════════════════
// findUserById
// ══════════════════════════════════════════════════════════════════════════

describe("findUserById", () => {
  it("deve retornar usuário quando ID existe", async () => {
    mockRepo.buscarPorId.mockResolvedValue(usuarioFake as any);

    const resultado = await service.findUserById(1);

    expect(mockRepo.buscarPorId).toHaveBeenCalledWith(1);
    expect(resultado.email).toBe("jorge@email.com");
  });

  it("deve lançar erro quando ID não existe", async () => {
    mockRepo.buscarPorId.mockResolvedValue(null);

    await expect(service.findUserById(999)).rejects.toThrow(
      "Usuário não encontrado"
    );
  });
});

// ══════════════════════════════════════════════════════════════════════════
// login
// ══════════════════════════════════════════════════════════════════════════

describe("login", () => {
  it("deve retornar token quando credenciais são válidas", async () => {
    mockRepo.buscarPorEmail.mockResolvedValue(usuarioFake as any);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
    (mockJwt.sign as jest.Mock).mockReturnValue("token.fake.aqui");

    const resultado = await service.login("jorge@email.com", "senha123");

    expect(resultado.sucesso).toBe(true);
    expect(resultado.token).toBe("token.fake.aqui");
    expect(resultado.user).toEqual({ id: 1, email: "jorge@email.com" });
  });

  it("deve retornar sucesso false quando email não existe", async () => {
    mockRepo.buscarPorEmail.mockResolvedValue(null);

    const resultado = await service.login("naoexiste@email.com", "senha123");

    expect(resultado.sucesso).toBe(false);
    expect(resultado.message).toBe("Email não encontrado");
    expect(mockBcrypt.compare).not.toHaveBeenCalled();
  });

  it("deve retornar sucesso false quando senha está errada", async () => {
    mockRepo.buscarPorEmail.mockResolvedValue(usuarioFake as any);
    (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);

    const resultado = await service.login("jorge@email.com", "senhaErrada");

    expect(resultado.sucesso).toBe(false);
    expect(resultado.message).toBe("Senha incorreta");
    expect(mockJwt.sign).not.toHaveBeenCalled();
  });
});

// ══════════════════════════════════════════════════════════════════════════
// removeUser
// ══════════════════════════════════════════════════════════════════════════

describe("removeUser", () => {
  it("deve deletar usuário existente com sucesso", async () => {
    mockRepo.buscarPorId.mockResolvedValue(usuarioFake as any);
    mockRepo.deletar.mockResolvedValue();

    const resultado = await service.removeUser(1);

    expect(mockRepo.deletar).toHaveBeenCalledWith(1);
    expect(resultado).toEqual({ message: "Usuário deletado com sucesso" });
  });

  it("deve lançar erro quando tenta deletar usuário inexistente", async () => {
    mockRepo.buscarPorId.mockResolvedValue(null);

    await expect(service.removeUser(999)).rejects.toThrow("Usuário não encontrado");
    expect(mockRepo.deletar).not.toHaveBeenCalled();
  });
});

// ══════════════════════════════════════════════════════════════════════════
// editUser
// ══════════════════════════════════════════════════════════════════════════

describe("editUser", () => {
  it("deve atualizar usuário com sucesso", async () => {
    mockRepo.buscarPorId.mockResolvedValue({ ...usuarioFake } as any);
    (mockBcrypt.hash as jest.Mock).mockResolvedValue("novoHash");
    mockRepo.atualizar.mockResolvedValue({ ...usuarioFake, email: "novo@email.com" } as any);

    const resultado = await service.editUser(1, "novo@email.com", "novaSenha123");

    expect(mockBcrypt.hash).toHaveBeenCalledWith("novaSenha123", 10);
    expect(mockRepo.atualizar).toHaveBeenCalled();
    expect(resultado).toEqual({ message: "Usuário atualizado com sucesso" });
  });

  it("deve lançar erro quando usuário não existe", async () => {
    mockRepo.buscarPorId.mockResolvedValue(null);

    await expect(
      service.editUser(999, "email@email.com", "senha123")
    ).rejects.toThrow("Usuário não encontrado");

    expect(mockRepo.atualizar).not.toHaveBeenCalled();
  });
});
