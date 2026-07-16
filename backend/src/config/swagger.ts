import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API de Usuários",
      version: "1.0.0",
      description: "Documentação da API de gerenciamento de usuários com autenticação JWT",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor local de desenvolvimento",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Insira o token JWT no formato: Bearer {token}",
        },
      },
      schemas: {
        // ─── Schemas de entrada ───────────────────────────────────────────────
        CadastroInput: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "jorge@email.com",
            },
            senha: {
              type: "string",
              minLength: 6,
              example: "senha123",
            },
          },
        },
        LoginInput: {
          type: "object",
          required: ["email", "senha"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "jorge@email.com",
            },
            senha: {
              type: "string",
              example: "senha123",
            },
          },
        },
        AtualizarInput: {
          type: "object",
          description: "Pelo menos um dos campos deve ser fornecido",
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "novo@email.com",
            },
            senha: {
              type: "string",
              minLength: 6,
              example: "novaSenha123",
            },
          },
        },

        // ─── Schemas de resposta ──────────────────────────────────────────────
        Usuario: {
          type: "object",
          properties: {
            id: { type: "integer", example: 1 },
            email: { type: "string", example: "jorge@email.com" },
            criadoEm: { type: "string", format: "date-time" },
          },
        },
        ErroResponse: {
          type: "object",
          properties: {
            sucesso: { type: "boolean", example: false },
            message: { type: "string", example: "Descrição do erro" },
          },
        },
        SucessoResponse: {
          type: "object",
          properties: {
            sucesso: { type: "boolean", example: true },
            message: { type: "string", example: "Operação realizada com sucesso!" },
          },
        },
      },
    },
    paths: {
      // ═══════════════════════════════════════════════════════════════════════
      // POST /cadastro
      // ═══════════════════════════════════════════════════════════════════════
      "/cadastro": {
        post: {
          tags: ["Autenticação"],
          summary: "Cadastrar novo usuário",
          description: "Cria um novo usuário com email e senha. O email deve ser único.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/CadastroInput" },
              },
            },
          },
          responses: {
            "201": {
              description: "Usuário cadastrado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    allOf: [
                      { $ref: "#/components/schemas/SucessoResponse" },
                      {
                        type: "object",
                        properties: {
                          id: { type: "integer", example: 1 },
                          email: { type: "string", example: "jorge@email.com" },
                        },
                      },
                    ],
                  },
                },
              },
            },
            "400": {
              description: "Dados inválidos (validação Zod)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: { sucesso: false, message: "Email inválido" },
                },
              },
            },
            "409": {
              description: "Email já cadastrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: { sucesso: false, message: "Email já cadastrado" },
                },
              },
            },
            "500": {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // POST /login
      // ═══════════════════════════════════════════════════════════════════════
      "/login": {
        post: {
          tags: ["Autenticação"],
          summary: "Login do usuário",
          description: "Autentica o usuário e retorna um token JWT.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/LoginInput" },
              },
            },
          },
          responses: {
            "200": {
              description: "Login realizado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sucesso: { type: "boolean", example: true },
                      token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                        description: "Token JWT para uso nas rotas protegidas",
                      },
                    },
                  },
                },
              },
            },
            "400": {
              description: "Dados inválidos (validação Zod)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
            "500": {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // GET /listar
      // ═══════════════════════════════════════════════════════════════════════
      "/listar": {
        get: {
          tags: ["Usuários"],
          summary: "Listar todos os usuários",
          description: "Retorna a lista completa de usuários. Requer autenticação JWT.",
          security: [{ bearerAuth: [] }],
          responses: {
            "200": {
              description: "Lista de usuários retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sucesso: { type: "boolean", example: true },
                      data: {
                        type: "array",
                        items: { $ref: "#/components/schemas/Usuario" },
                      },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Token ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: { sucesso: false, message: "Token inválido ou expirado" },
                },
              },
            },
            "500": {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // GET /listar/:id
      // ═══════════════════════════════════════════════════════════════════════
      "/listar/{id}": {
        get: {
          tags: ["Usuários"],
          summary: "Buscar usuário por ID",
          description: "Retorna os dados de um usuário específico. Requer autenticação JWT.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID numérico do usuário",
              schema: { type: "integer", example: 1 },
            },
          ],
          responses: {
            "200": {
              description: "Usuário encontrado",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      sucesso: { type: "boolean", example: true },
                      data: { $ref: "#/components/schemas/Usuario" },
                    },
                  },
                },
              },
            },
            "401": {
              description: "Token ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
            "404": {
              description: "Usuário não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: { sucesso: false, message: "Usuário não encontrado" },
                },
              },
            },
            "500": {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // DELETE /deletar/:id
      // ═══════════════════════════════════════════════════════════════════════
      "/deletar/{id}": {
        delete: {
          tags: ["Usuários"],
          summary: "Deletar usuário",
          description: "Remove um usuário pelo ID. Requer autenticação JWT.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID numérico do usuário a ser deletado",
              schema: { type: "integer", example: 1 },
            },
          ],
          responses: {
            "200": {
              description: "Usuário deletado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SucessoResponse" },
                  example: { sucesso: true, message: "Usuário deletado com sucesso!" },
                },
              },
            },
            "401": {
              description: "Token ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
            "404": {
              description: "Usuário não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: { sucesso: false, message: "Usuário não encontrado" },
                },
              },
            },
            "500": {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
          },
        },
      },

      // ═══════════════════════════════════════════════════════════════════════
      // PUT /atualizar/:id
      // ═══════════════════════════════════════════════════════════════════════
      "/atualizar/{id}": {
        put: {
          tags: ["Usuários"],
          summary: "Atualizar dados do usuário",
          description:
            "Atualiza email e/ou senha de um usuário. Pelo menos um campo deve ser enviado. Requer autenticação JWT.",
          security: [{ bearerAuth: [] }],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "ID numérico do usuário a ser atualizado",
              schema: { type: "integer", example: 1 },
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/AtualizarInput" },
              },
            },
          },
          responses: {
            "200": {
              description: "Usuário atualizado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/SucessoResponse" },
                  example: { sucesso: true, message: "Usuário atualizado com sucesso!" },
                },
              },
            },
            "400": {
              description: "Dados inválidos ou nenhum campo enviado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: {
                    sucesso: false,
                    message: "Pelo menos um campo (email ou senha) deve ser fornecido",
                  },
                },
              },
            },
            "401": {
              description: "Token ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
            "404": {
              description: "Usuário não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                  example: { sucesso: false, message: "Usuário não encontrado" },
                },
              },
            },
            "500": {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ErroResponse" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [], // Não usamos JSDoc inline, tudo está definido acima
};

export const swaggerSpec = swaggerJsdoc(options);