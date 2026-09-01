import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
// importando os decorators do TypeORM
// decorator é aquela coisa com @ que fica em cima das classes/propriedades
// eles dizem pro TypeORM como montar a tabela no banco

import "reflect-metadata";
// necessário pro TypeORM funcionar com decorators
// é um requisito técnico, só precisa importar e pronto

import { Usuario } from "./user";
// importa o model de usuário pra poder fazer a relação entre as tabelas

@Entity("remedios")
// esse decorator diz: "essa classe representa a tabela 'remedios' no banco"
// tudo que tiver aqui vai virar coluna nessa tabela
export class Remedio {

    @PrimaryGeneratedColumn()
    id: number;
    // chave primária da tabela — gerada automaticamente pelo banco (1, 2, 3...)
    // todo registro tem um id único

    @Column({ length: 100, nullable: false })
    nome: string;
    // coluna normal, texto de até 100 caracteres
    // nullable: false = obrigatório, não pode salvar remédio sem nome

    @Column({ length: 5, nullable: false })
    horario: string;
    // guarda só o horário no formato "08:00" (5 caracteres exatos)
    // nullable: false = também obrigatório

    @Column({ default: false })
    tomado: boolean;
    // true ou false — o usuário já tomou esse remédio hoje?
    // default: false = quando cria o remédio, começa como não tomado

    @Column({ type: "text", nullable: true })
    observacoes: string;
    // texto livre, sem limite de tamanho (type: "text")
    // nullable: true = opcional, pode salvar sem observação

    @ManyToOne(() => Usuario, { onDelete: "CASCADE" })
    // relação muitos-pra-um: muitos remédios pertencem a um usuário
    // onDelete: "CASCADE" = se o usuário for deletado, os remédios dele somem junto
    // (não fica lixo órfão no banco)
    
    @JoinColumn({ name: "usuario_id" })
    // diz que a coluna "usuario_id" é a chave estrangeira dessa relação
    // chave estrangeira = coluna que aponta pra outro registro em outra tabela
    usuario: Usuario;
    // essa propriedade deixa acessar o objeto usuário completo pelo remédio
    // tipo: remedio.usuario.nome

    @Column({ name: "usuario_id" })
    usuarioId: number;
    // guarda só o número do id do usuário
    // existe junto com o "usuario" acima pra você poder acessar direto o id
    // sem precisar carregar o objeto Usuario inteiro do banco

    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;
    // preenchida automaticamente pelo TypeORM quando o registro é criado
    // você nunca precisa setar isso manualmente

    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
    // atualizada automaticamente toda vez que o registro é salvo
    // útil pra saber quando o remédio foi editado por último
}