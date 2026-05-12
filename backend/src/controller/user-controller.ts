import { Request, Response } from "express";
import * as service from "../services/user-services";
import { AuthRequest } from "../middlewares/auth-middlewares";

export const cadastro = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        message: "Email e senha são obrigatórios"
      });
    }
    
    const resultado = await service.registerUser({ email, senha });
    res.status(201).json({ sucesso: true, ...resultado });
  } catch (error: any) {
    console.error("Erro no cadastro:", error.message);
    
    if (error.message === "Email já cadastrado") {
      return res.status(409).json({ sucesso: false, message: error.message });
    }
    
    res.status(500).json({ sucesso: false, message: "Erro ao cadastrar" });
  }
};

export const listar = async (req: AuthRequest, res: Response) => {
  try {
    const users = await service.listUsers();
    res.json({ sucesso: true, data: users });
  } catch (error) {
    console.error("Erro ao listar:", error);
    res.status(500).json({ sucesso: false, message: "Erro ao listar usuários" });
  }
};

export const listarPorId = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await service.findUserById(id);
    res.json({ sucesso: true, data: user });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ sucesso: false, message: error.message });
    }
    res.status(500).json({ sucesso: false, message: "Erro ao listar usuário" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        message: "Email e senha são obrigatórios"
      });
    }
    
    const resultado = await service.login(email, senha);
    res.json(resultado);
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ sucesso: false, message: "Erro ao fazer login" });
  }
};

export const deletar = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    await service.removeUser(id);
    res.json({ sucesso: true, message: "Usuário deletado com sucesso!" });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ sucesso: false, message: error.message });
    }
    res.status(500).json({ sucesso: false, message: "Erro ao deletar usuário" });
  }
};

export const atualizar = async (req: AuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { email, senha } = req.body;
    
    if (!email || !senha) {
      return res.status(400).json({
        sucesso: false,
        message: "Email e senha são obrigatórios"
      });
    }
    
    await service.editUser(id, email, senha);
    res.json({ sucesso: true, message: "Usuário atualizado com sucesso!" });
  } catch (error: any) {
    if (error.message === "Usuário não encontrado") {
      return res.status(404).json({ sucesso: false, message: error.message });
    }
    res.status(500).json({ sucesso: false, message: "Erro ao atualizar usuário" });
  }
};