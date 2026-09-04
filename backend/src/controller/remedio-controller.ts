import { Response } from "express";
import { AuthRequest } from "../middlewares/auth-middlewares";
import * as service from "../services/remedio-services";
// importando as paradas que vamos usar:
// Response = tipo do "res" que a gente usa pra responder o front
// AuthRequest = tipo customizado de requisição que já tem o usuário logado dentro
// service = todas as funções que fazem o trabalho pesado (banco de dados, lógica, etc)

// ==================== CRIAR REMÉDIO ====================
export const criar = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        // pega o id do usuário que tá logado
        // o "?" é pra não explodir caso req.user seja undefined

        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });
        // se não tiver id, manda 401 (não autorizado) e para tudo aqui

        const resultado = await service.criarRemedio(usuarioId, req.body);
        // chama a função do service passando o id do usuário e os dados do remédio
        // req.body é o JSON que o front mandou (nome, dose, horário, etc)

        res.status(201).json({ sucesso: true, data: resultado });
        // 201 = "criado com sucesso", manda o remédio criado de volta pro front
    } catch (error: any) {
        res.status(500).json({ sucesso: false, message: "Erro ao criar remédio" });
        // 500 = erro no servidor, algo explodiu que a gente não esperava
    }
};

// ==================== LISTAR REMÉDIOS ====================
export const listar = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });

        const resultado = await service.listarRemedios(usuarioId);
        // busca TODOS os remédios desse usuário específico
        // repara que não passa req.body pq é só um GET, sem corpo

        res.json({ sucesso: true, data: resultado });
        // sem status aqui = 200 por padrão (ok, deu certo)
    } catch (error: any) {
        res.status(500).json({ sucesso: false, message: "Erro ao listar remédios" });
    }
};

// ==================== BUSCAR UM REMÉDIO POR ID ====================
export const buscarPorId = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });

        const id = Number(req.params.id);
        // req.params.id pega o :id da URL, tipo /remedios/7
        // Number() converte pra número porque params sempre vem como string

        if (isNaN(id)) return res.status(400).json({ sucesso: false, message: "ID inválido" });
        // se alguém mandou /remedios/banana, isNaN retorna true e a gente barra
        // 400 = requisição inválida (culpa do front/usuário, não do servidor)

        const resultado = await service.buscarRemedioPorId(id, usuarioId);
        res.json({ sucesso: true, data: resultado });
    } catch (error: any) {
        if (error.message === "Remédio não encontrado") return res.status(404).json({ sucesso: false, message: error.message });
        // 404 = não encontrado (clássico)

        if (error.message === "Sem permissão") return res.status(403).json({ sucesso: false, message: error.message });
        // 403 = proibido — o remédio existe, mas não é desse usuário
        // (importante: um user não pode ver remédio de outro user!)

        res.status(500).json({ sucesso: false, message: "Erro ao buscar remédio" });
    }
};

// ==================== ATUALIZAR REMÉDIO ====================
export const atualizar = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });

        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ sucesso: false, message: "ID inválido" });

        const resultado = await service.atualizarRemedio(id, usuarioId, req.body);
        // passa o id do remédio, id do usuário (pra checar se é dele) e os dados novos (req.body)

        res.json({ sucesso: true, data: resultado });
    } catch (error: any) {
        if (error.message === "Remédio não encontrado") return res.status(404).json({ sucesso: false, message: error.message });
        if (error.message === "Sem permissão") return res.status(403).json({ sucesso: false, message: error.message });
        res.status(500).json({ sucesso: false, message: "Erro ao atualizar remédio" });
    }
};

// ==================== DELETAR REMÉDIO ====================
export const deletar = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });

        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ sucesso: false, message: "ID inválido" });

        const resultado = await service.deletarRemedio(id, usuarioId);

        res.json({ sucesso: true, ...resultado });
        // o "..." (spread) joga tudo que veio do service junto com "sucesso: true"
        // tipo se resultado = { message: "deletado" }, vira { sucesso: true, message: "deletado" }
    } catch (error: any) {
        if (error.message === "Remédio não encontrado") return res.status(404).json({ sucesso: false, message: error.message });
        if (error.message === "Sem permissão") return res.status(403).json({ sucesso: false, message: error.message });
        res.status(500).json({ sucesso: false, message: "Erro ao deletar remédio" });
    }
};

// ==================== MARCAR COMO TOMADO ====================
export const marcarTomado = async (req: AuthRequest, res: Response) => {
    try {
        const usuarioId = req.user?.id;
        if (!usuarioId) return res.status(401).json({ sucesso: false, message: "Usuário não autenticado" });

        const id = Number(req.params.id);
        if (isNaN(id)) return res.status(400).json({ sucesso: false, message: "ID inválido" });

        const resultado = await service.marcarTomado(id, usuarioId);
        // essa é a função específica do MedTime — marca que o usuário tomou o remédio
        // salva um registro de histórico no banco

        res.json({ sucesso: true, data: resultado });
    } catch (error: any) {
        if (error.message === "Remédio não encontrado") return res.status(404).json({ sucesso: false, message: error.message });
        if (error.message === "Sem permissão") return res.status(403).json({ sucesso: false, message: error.message });
        res.status(500).json({ sucesso: false, message: "Erro ao marcar remédio" });
    }
};