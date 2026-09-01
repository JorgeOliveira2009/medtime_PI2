import { Remedio } from "../models/remedio";
import { remedioRepository } from "../repositories/remedio-repositories";

// ==================== CRIAR ====================
export const criarRemedio = async (
    usuarioId: number,
    dados: {
        nome: string;
        horario: string;
        observacoes?: string;
        // "?" = opcional — o Zod já garantiu o formato antes de chegar aqui
    }
) => {
    const remedio = new Remedio();
    remedio.usuarioId = usuarioId;
    remedio.nome = dados.nome;
    remedio.horario = dados.horario;

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
    // todos formatados do mesmo jeito
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
        observacoes: string;
        // Partial<> torna todos os campos opcionais automaticamente
        // equivale a colocar "?" em cada um manualmente
    }>
) => {
    const remedio = await remedioRepository.buscarPorId(id);
    // busca direto pelo repository — diferente da versão anterior do service
    // que reutilizava buscarRemedioPorId() pra evitar repetição

    if (!remedio) throw new Error("Remédio não encontrado");
    if (remedio.usuarioId !== usuarioId) throw new Error("Sem permissão");

    if (dados.nome)       remedio.nome = dados.nome;
    if (dados.horario)    remedio.horario = dados.horario;
    if (dados.observacoes !== undefined) remedio.observacoes = dados.observacoes;
    // nome e horario: "if (dados.x)" — falsy check, não atualiza se vier vazio
    // observacoes: "!== undefined" — atualiza mesmo se vier string vazia ""
    // (faz sentido querer apagar uma observação mandando "")

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
    // toggle — inverte o valor atual
    // true → false → true → false...
    // primeira chamada marca tomado, segunda desmarca, e assim vai

    const atualizado = await remedioRepository.atualizar(remedio);
    return formatarRemedio(atualizado);
};

// ==================== HELPER ====================
const formatarRemedio = (remedio: Remedio) => ({
    // essa função existe pra padronizar o formato de resposta
    // todo mundo que retorna um remédio passa por aqui
    // assim o front sempre recebe o mesmo shape, independente da operação

    id: remedio.id,
    nome: remedio.nome,
    horario: remedio.horario,
    tomado: remedio.tomado,
    observacoes: remedio.observacoes ?? null,
    // "??" = se observacoes for undefined, manda null explícito
    // melhor que mandar undefined, que some do JSON

    usuarioId: remedio.usuarioId,
    createdAt: remedio.createdAt,
    updatedAt: remedio.updatedAt,
});