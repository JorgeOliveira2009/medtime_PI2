import { Remedio } from "../models/remedio";
import { remedioRepository } from "../repositories/remedio-repositories";

// ==================== CRIAR ====================
export const criarRemedio = async (
    usuarioId: number,
    dados: {
        nome: string;
        horario: string;
        data: string;
        observacoes?: string;
        // "?" = opcional — o Zod já garantiu o formato antes de chegar aqui
    }
) => {
    const remedio = new Remedio();

    remedio.usuarioId = usuarioId;
    remedio.nome = dados.nome;
    remedio.horario = dados.horario;
    remedio.data = dados.data;

    if (dados.observacoes) remedio.observacoes = dados.observacoes;
    // só atribui observacoes se vier — se não vier, deixa o default do banco

    const salvo = await remedioRepository.criar(remedio);

    return formatarRemedio(salvo);
    // não retorna o objeto cru do banco — passa pelo formatarRemedio primeiro
};

// ==================== LISTAR ====================
export const listarRemedios = async (usuarioId: number) => {
    const remedios = await remedioRepository.buscarTodosPorUsuario(usuarioId);

    return remedios.map(formatarRemedio);
    // .map() passa cada remédio pelo formatarRemedio e retorna um array novo
};

// ==================== BUSCAR POR ID ====================
export const buscarRemedioPorId = async (id: number, usuarioId: number) => {
    const remedio = await remedioRepository.buscarPorId(id);

    if (!remedio) throw new Error("Remédio não encontrado");
    // não achou no banco — vai virar 404 no controller

    if (remedio.usuarioId !== usuarioId) throw new Error("Sem permissão");
    // achou, mas é de outro usuário — vai virar 403 no controller

    return formatarRemedio(remedio);
};

// ==================== ATUALIZAR ====================
export const atualizarRemedio = async (
    id: number,
    usuarioId: number,
    dados: Partial<{
        nome: string;
        horario: string;
        data: string;
        observacoes: string;
        // Partial<> torna todos os campos opcionais automaticamente
    }>
) => {
    const remedio = await remedioRepository.buscarPorId(id);

    if (!remedio) throw new Error("Remédio não encontrado");
    if (remedio.usuarioId !== usuarioId) throw new Error("Sem permissão");

    if (dados.nome) remedio.nome = dados.nome;
    if (dados.horario) remedio.horario = dados.horario;
    if (dados.data) remedio.data = dados.data;

    if (dados.observacoes !== undefined) {
        remedio.observacoes = dados.observacoes;
    }

    const atualizado = await remedioRepository.atualizar(remedio);

    return formatarRemedio(atualizado);
};

// ==================== DELETAR ====================
export const deletarRemedio = async (id: number, usuarioId: number) => {
    const remedio = await remedioRepository.buscarPorId(id);

    if (!remedio) throw new Error("Remédio não encontrado");
    if (remedio.usuarioId !== usuarioId) throw new Error("Sem permissão");

    await remedioRepository.deletar(id);

    return { message: "Remédio deletado com sucesso" };
};

// ==================== MARCAR TOMADO ====================
export const marcarTomado = async (id: number, usuarioId: number) => {
    const remedio = await remedioRepository.buscarPorId(id);

    if (!remedio) throw new Error("Remédio não encontrado");
    if (remedio.usuarioId !== usuarioId) throw new Error("Sem permissão");

    remedio.tomado = !remedio.tomado;

    // true → false → true → false...

    const atualizado = await remedioRepository.atualizar(remedio);

    return formatarRemedio(atualizado);
};

// ==================== HELPER ====================
const formatarRemedio = (remedio: Remedio) => ({
    id: remedio.id,
    nome: remedio.nome,
    horario: remedio.horario,
    data: remedio.data,
    tomado: remedio.tomado,

    observacoes: remedio.observacoes ?? null,

    usuarioId: remedio.usuarioId,
    createdAt: remedio.createdAt,
    updatedAt: remedio.updatedAt,
});