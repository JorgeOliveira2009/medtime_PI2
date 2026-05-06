import { Request, Response } from "express";
import * as service from "../services/user-services";

export const cadastro = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;

    await service.registerUser({ email, senha });

    res.send("Cadastro realizado com sucesso!");
  } catch {
    res.status(500).send("Erro ao cadastrar");
  }
};

export const listar = async (req: Request, res: Response) => {
  try {
    const users = await service.listUsers();
    res.json(users);
  } catch {
    res.status(500).send("Erro ao listar");
  }
};

export const listarPorId = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const user = await service.findUserById(id);
    res.json(user);
  } catch {
    res.status(500).send("Erro ao listar");
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    const sucesso = await service.login(email, senha);
    res.json({ sucesso });
  } catch {
    res.status(500).json({ sucesso: false });
  }
};

export const deletar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    await service.removeUser(id);
    res.send("Usuário deletado com sucesso!");
  } catch {
    res.status(500).send("Erro ao deletar");
  }
};

export const atualizar = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { email, senha } = req.body;
    await service.editUser(id, email, senha);
    res.send("Usuário atualizado com sucesso!");
  } catch {
    res.status(500).send("Erro ao atualizar");
  }
};