import { Usuario } from "../models/user";
import { AppDataSource } from "../config/database";

// Classe que concentra todas as operações de banco do usuário num só lugar
// Os services chamam daqui em vez de falar direto com o banco — fica mais organizado
export class UsuarioRepository {
    // pega o repositório do TypeORM pra tabela de usuários
    private repository = AppDataSource.getRepository(Usuario);

    // salva um usuário novo no banco
    async criar(usuario: Usuario) {
        return await this.repository.save(usuario);
    }

    // busca todos os usuários da tabela
    async buscarTodos(): Promise<Usuario[]> {
        return await this.repository.find();
    }

    // busca um usuário pelo id — retorna null se não achar
    async buscarPorId(id: number): Promise<Usuario | null> {
        return await this.repository.findOneBy({ id });
    }

    // busca um usuário pelo email — retorna null se não achar
    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return await this.repository.findOneBy({ email });
    }

    // atualiza os dados de um usuário que já existe
    async atualizar(usuario: Usuario): Promise<Usuario> {
        return await this.repository.save(usuario); // o save atualiza se o id já existir
    }

    // remove um usuário do banco pelo id
    async deletar(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}

// exporta uma instância pronta pra não precisar fazer "new" em cada arquivo que usar
export const usuarioRepository = new UsuarioRepository();