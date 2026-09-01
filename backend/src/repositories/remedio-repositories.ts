import { AppDataSource } from "../config/database";
// AppDataSource é a conexão com o banco de dados
// é tipo o "fio" que liga o código ao banco

import { Remedio } from "../models/remedio";
// importa o model pra saber o formato dos dados

export class RemedioRepository {

    private repository = AppDataSource.getRepository(Remedio);
    // getRepository(Remedio) cria um repositório específico pra tabela de remédios
    // ele já vem com vários métodos prontos: save, findBy, delete, etc.
    // "private" = só a própria classe acessa, ninguém de fora mexe nisso diretamente

    async criar(remedio: Remedio): Promise<Remedio> {
        return await this.repository.save(remedio);
        // save() insere um registro novo no banco
        // retorna o remédio já salvo, com o id gerado pelo banco preenchido
    }

    async buscarTodosPorUsuario(usuarioId: number): Promise<Remedio[]> {
        return await this.repository.findBy({ usuarioId });
        // findBy filtra os registros pelo campo passado
        // { usuarioId } é shorthand de { usuarioId: usuarioId }
        // retorna um array — pode ser vazio se o usuário não tiver remédios
    }

    async buscarPorId(id: number): Promise<Remedio | null> {
        return await this.repository.findOneBy({ id });
        // findOneBy busca um único registro
        // retorna o remédio OU null se não achar nada
        // por isso o tipo é "Remedio | null" — pode vir das duas formas
    }

    async atualizar(remedio: Remedio): Promise<Remedio> {
        return await this.repository.save(remedio);
        // sim, é o mesmo save() do criar!
        // o TypeORM é esperto: se o objeto tem id → faz UPDATE
        //                      se não tem id → faz INSERT
    }

    async deletar(id: number): Promise<void> {
        await this.repository.delete(id);
        // deleta o registro com esse id do banco
        // Promise<void> = não retorna nada, só executa e acabou
    }
}

export const remedioRepository = new RemedioRepository();
// cria uma instância única da classe e exporta
// assim todo mundo que importar vai usar o mesmo objeto
// isso se chama singleton — evita criar várias conexões desnecessárias