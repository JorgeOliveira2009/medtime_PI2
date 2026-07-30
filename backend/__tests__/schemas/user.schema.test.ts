/**
 * Testes dos schemas Zod — user.schema.ts
 *
 * Valida diretamente os schemas sem depender de mocks.
 * São os testes mais simples e rápidos do projeto.
 */

import { createUserScheme, loginScheme, updateUserScheme } from "../../src/schemas/user.schema";

// ══════════════════════════════════════════════════════════════════════════
// createUserScheme
// ══════════════════════════════════════════════════════════════════════════

describe("createUserScheme", () => {
  it("deve validar dados corretos", () => {
    const dados = { email: "jorge@email.com", senha: "senha123" };
    expect(() => createUserScheme.parse(dados)).not.toThrow();
  });

  it("deve rejeitar email inválido", () => {
    const dados = { email: "naoéumemail", senha: "senha123" };
    expect(() => createUserScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar senha menor que 8 caracteres", () => {
    const dados = { email: "jorge@email.com", senha: "12345" };
    expect(() => createUserScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar quando email está ausente", () => {
    const dados = { senha: "senha123" };
    expect(() => createUserScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar quando senha está ausente", () => {
    const dados = { email: "jorge@email.com" };
    expect(() => createUserScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar senha maior que 100 caracteres", () => {
    const dados = { email: "jorge@email.com", senha: "a".repeat(101) };
    expect(() => createUserScheme.parse(dados)).toThrow();
  });
});

// ══════════════════════════════════════════════════════════════════════════
// loginScheme
// ══════════════════════════════════════════════════════════════════════════

describe("loginScheme", () => {
  it("deve validar dados de login corretos", () => {
    const dados = { email: "jorge@email.com", senha: "qualquersenha" };
    expect(() => loginScheme.parse(dados)).not.toThrow();
  });

  it("deve rejeitar email inválido no login", () => {
    const dados = { email: "invalido", senha: "qualquersenha" };
    expect(() => loginScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar senha vazia no login", () => {
    const dados = { email: "jorge@email.com", senha: "" };
    expect(() => loginScheme.parse(dados)).toThrow();
  });
});

// ══════════════════════════════════════════════════════════════════════════
// updateUserScheme
// ══════════════════════════════════════════════════════════════════════════

describe("updateUserScheme", () => {
  it("deve validar atualização só de email", () => {
    const dados = { email: "novo@email.com" };
    expect(() => updateUserScheme.parse(dados)).not.toThrow();
  });

  it("deve validar atualização só de senha", () => {
    const dados = { senha: "novaSenha123" };
    expect(() => updateUserScheme.parse(dados)).not.toThrow();
  });

  it("deve validar atualização dos dois campos juntos", () => {
    const dados = { email: "novo@email.com", senha: "novaSenha123" };
    expect(() => updateUserScheme.parse(dados)).not.toThrow();
  });

  it("deve rejeitar quando nenhum campo é enviado", () => {
    const dados = {};
    expect(() => updateUserScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar email inválido na atualização", () => {
    const dados = { email: "naoéemail" };
    expect(() => updateUserScheme.parse(dados)).toThrow();
  });

  it("deve rejeitar senha curta na atualização", () => {
    const dados = { senha: "123" };
    expect(() => updateUserScheme.parse(dados)).toThrow();
  });
});
