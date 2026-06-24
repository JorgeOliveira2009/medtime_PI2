import { Usuario } from "../models/user";
import { AppDataSource } from "../config/database";

export class UsuarioRepository {
    private repository = AppDataSource.getRepository(Usuario);

    async criar(usuario: Usuario) {
        return await this.repository.save(usuario);
    }

    async buscarTodos(): Promise<Usuario[]> {
        return await this.repository.find();
    }

    async buscarPorId(id: number): Promise<Usuario | null> {
        return await this.repository.findOneBy({ id });
    }

    async buscarPorEmail(email: string): Promise<Usuario | null> {
        return await this.repository.findOneBy({ email });
    }

    async atualizar(usuario: Usuario): Promise<Usuario> {
        return await this.repository.save(usuario);
    }

    async deletar(id: number): Promise<void> {
        await this.repository.delete(id);
    }
}

export const usuarioRepository = new UsuarioRepository();