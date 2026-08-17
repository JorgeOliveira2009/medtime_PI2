import { Request, Response } from "express"; 
import * as service from "../services/user-services"; 
import { AuthRequest } from "../middlewares/auth-middlewares"; 
 
// CADASTRO - Essa parte não precisa de login para funcionar.
// Aqui eu recebo os dados que o usuário colocou no aplicativo
// e mando para o service fazer o cadastro no banco de dados.
export const cadastro = async (req: Request, res: Response) => { 
    try { 
        // Pego o nome, email e senha que vieram do aplicativo.
        const { email, senha, nome } = req.body; 
         
        // Mando esses dados para o service cadastrar o novo usuário.
        const resultado = await service.registerUser(email, senha, nome); 
         
        // Se der tudo certo, retorno que o cadastro foi realizado.
        res.status(201).json({  
            sucesso: true,  
            ...resultado  
        }); 
    } catch (error: any) { 
        // Se acontecer algum erro, mostro no terminal para facilitar
        // na hora de descobrir o que aconteceu.
        console.error("Erro no cadastro:", error.message); 
         
        // Se o email já estiver cadastrado, aviso o aplicativo
        // que não é possível criar outro usuário com o mesmo email.
        if (error.message === "Email já cadastrado") { 
            return res.status(409).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
         
        // Se for outro erro, retorno uma mensagem mais geral.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao cadastrar usuário"  
        }); 
    } 
}; 
 
// LOGIN - Também é uma função pública, então o usuário
// não precisa estar logado para tentar entrar na conta.
export const login = async (req: Request, res: Response) => { 
    try { 
        // Pego o email e a senha que o usuário informou.
        const { email, senha } = req.body; 
        
        // Envio esses dados para o service conferir se estão corretos.
        const resultado = await service.login(email, senha); 
         
        // Se os dados estiverem certos, devolvo o resultado do login.
        res.json({  
            sucesso: true,  
            ...resultado  
        }); 
    } catch (error: any) { 
        console.error("Erro no login:", error.message); 
         
        // Se o email ou senha estiverem errados, aviso que o login falhou.
        if (error.message === "Email ou senha inválidos") { 
            return res.status(401).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
         
        // Caso aconteça algum outro problema no servidor.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao fazer login"  
        }); 
    } 
}; 
 
// LISTAR TODOS - Essa função é protegida.
// Ela busca todos os usuários que estão cadastrados no banco.
export const listar = async (req: Request, res: Response) => { 
    try { 
        // Peço para o service buscar todos os usuários.
        const users = await service.listUsers(); 
        
        // Devolvo a lista para quem fez a requisição.
        res.json({  
            sucesso: true,  
            data: users  
        }); 
    } catch (error) { 
        console.error("Erro ao listar:", error); 
        
        // Caso aconteça algum problema ao buscar os usuários.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao listar usuários"  
        }); 
    } 
}; 
 
//LISTAR PERFIL - Aqui eu uso o token do usuário.
// Assim não preciso receber o ID pela URL, porque o ID já está
// guardado nas informações do usuário que fez login.
export const listarPerfil = async (req: AuthRequest, res: Response) => { 
    try { 
        // Pego o ID do usuário que está no token.
        const id = req.user?.id; 
         
        // Se não existir um ID, significa que o usuário não está autenticado.
        if (!id) { 
            return res.status(401).json({  
                sucesso: false,  
                message: "Usuário não autenticado"  
            }); 
        } 
         
        // Com o ID, procuro os dados desse usuário no banco.
        const user = await service.findUserById(id); 
        
        // Devolvo os dados encontrados.
        res.json({  
            sucesso: true,  
            data: user  
        }); 
    } catch (error: any) { 
        // Se não encontrar o usuário, retorno erro 404.
        if (error.message === "Usuário não encontrado") { 
            return res.status(404).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
        
        // Caso aconteça outro problema.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao buscar perfil"  
        }); 
    } 
}; 
 
// LISTAR POR ID - Aqui o usuário pode buscar um perfil
// usando um ID, mas somente se esse ID for o próprio ID dele.
export const listarPorId = async (req: AuthRequest, res: Response) => { 
    try { 
        // Pego o ID que veio na URL.
        const id = Number(req.params.id); 
        
        // Pego o ID do usuário que está logado.
        const usuarioLogadoId = req.user?.id; 
         
        // Comparo os dois IDs para impedir que um usuário
        // veja o perfil de outra pessoa.
        if (id !== usuarioLogadoId) { 
            return res.status(403).json({  
                sucesso: false,  
                message: "Você só pode visualizar seu próprio perfil"  
            }); 
        } 
         
        // Se os IDs forem iguais, busco o usuário no banco.
        const user = await service.findUserById(id); 
        
        // Retorno os dados encontrados.
        res.json({  
            sucesso: true,  
            data: user  
        }); 
    } catch (error: any) { 
        if (error.message === "Usuário não encontrado") { 
            return res.status(404).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
        
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao buscar usuário"  
        }); 
    } 
}; 
 
// DELETAR CONTA - Aqui o usuário consegue excluir a própria conta.
// O ID é retirado do token para garantir que ele só possa
// excluir a conta que está usando.
export const deletarConta = async (req: AuthRequest, res: Response) => { 
    try { 
        // Pego o ID do usuário que está logado.
        const usuarioLogadoId = req.user?.id; 
         
        console.log("🗑️ Deletando conta..."); 
        console.log("👤 Usuário logado ID:", usuarioLogadoId); 
         
        // Se não tiver um ID, o usuário não está autenticado.
        if (!usuarioLogadoId) { 
            return res.status(401).json({  
                sucesso: false,  
                message: "Usuário não autenticado"  
            }); 
        } 
         
        // Mando o ID para o service excluir o usuário do banco.
        await service.removeUser(usuarioLogadoId); 
         
        // Aviso que a conta foi excluída com sucesso.
        res.json({  
            sucesso: true,  
            message: "Conta deletada com sucesso!"  
        }); 
    } catch (error: any) { 
        console.error("Erro ao deletar conta:", error); 
         
        // Caso o usuário não exista no banco.
        if (error.message === "Usuário não encontrado") { 
            return res.status(404).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
        
        // Caso aconteça outro erro.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao deletar conta"  
        }); 
    } 
}; 
 
// ATUALIZAR - Permite que o usuário altere seus próprios dados.
// O ID também vem do token, então não é possível escolher o ID
// de outra pessoa pela URL.
export const atualizar = async (req: AuthRequest, res: Response) => { 
    try { 
        // Pego o ID do usuário que está logado através do token.
        const usuarioLogadoId = req.user?.id; 
         
        console.log("✏️ Atualizando usuário..."); 
        console.log("👤 Usuário logado ID:", usuarioLogadoId); 
         
        // Se não tiver ID, significa que não existe um usuário autenticado.
        if (!usuarioLogadoId) { 
            return res.status(401).json({  
                sucesso: false,  
                message: "Usuário não autenticado"  
            }); 
        } 
         
        // Pego os novos dados enviados pelo usuário.
        const { nome, email, senha } = req.body; 
 
        // Envio os dados para o service atualizar no banco.
        const resultado = await service.editUser(usuarioLogadoId, email, senha, nome); 
         
        // Retorno o resultado da atualização.
        res.json({  
            sucesso: true,  
            ...resultado  
        }); 
    } catch (error: any) { 
        console.error("Erro ao atualizar:", error); 
         
        // Se o usuário não existir, retorno um erro.
        if (error.message === "Usuário não encontrado") { 
            return res.status(404).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
        
        // Caso aconteça outro problema na atualização.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao atualizar usuário"  
        }); 
    } 
}; 
 
// ADMIN - Essa função permite excluir qualquer usuário
// informando o ID dele. Ela pode ser usada para uma função
// de administrador do sistema.
export const deletar = async (req: Request, res: Response) => { 
    try { 
        // Pego o ID do usuário que quero excluir pela URL.
        const id = Number(req.params.id); 
        
        // Mando o ID para o service fazer a exclusão.
        await service.removeUser(id); 
        
        // Aviso que o usuário foi excluído.
        res.json({  
            sucesso: true,  
            message: "Usuário deletado com sucesso!"  
        }); 
    } catch (error: any) { 
        // Caso o usuário informado não exista.
        if (error.message === "Usuário não encontrado") { 
            return res.status(404).json({  
                sucesso: false,  
                message: error.message  
            }); 
        } 
        
        // Caso aconteça algum outro erro.
        res.status(500).json({  
            sucesso: false,  
            message: "Erro ao deletar usuário"  
        }); 
    } 
};