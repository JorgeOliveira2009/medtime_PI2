import { Usuario } from "../models/user";
import { AppDataSource } from "../config/database";

export class UsuarioRepository {
    // pega o repositório do TypeORM pra tabela usuarios
    // é por aqui que todas as queries passam
    private repository = AppDataSource.getRepository(Usuario);

    // INSERT — salva um novo usuário no banco
    async criar(usuario: Usuario) {
        return await this.repository.save(usuario);
    }

    // SELECT * — busca todos os usuários
    async buscarTodos(): Promise<Usuario[]> {
        return await this.repository.find();
    }

    // SELECT WHERE id — busca um usuário pelo id
    // retorna null se não encontrar (por isso o Usuario | null)
    async buscarPorId(id: number): Promise<Usuario | null> {
        return await this.repository.findOneBy({ id });
    }

    // SELECT WHERE email — usado no login pra achar o usuário pelo email
    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return await this.repository.findOneBy({ email });
    }

    // UPDATE — o save() do TypeORM atualiza se o id já existe
    async atualizar(usuario: Usuario): Promise<Usuario> {
        return await this.repository.save(usuario);
    }

    // DELETE WHERE id
    async deletar(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}

// exporta uma instância pronta pra não precisar dar new em todo lugar
export const usuarioRepository = new UsuarioRepository();