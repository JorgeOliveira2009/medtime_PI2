import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from "typeorm";
import "reflect-metadata";

// @Entity diz pro TypeORM que essa classe representa uma tabela no banco
// o nome "usuarios" é o nome que a tabela vai ter no MySQL
@Entity("usuarios")
export class Usuario {

    // chave primária que incrementa sozinha (1, 2, 3...)
    @PrimaryGeneratedColumn()
    id: number;

    // coluna de texto com no máximo 100 caracteres, não pode ser vazia
    @Column({ length: 100, nullable: false })
    nome: string;

    // coluna de email — o unique: true garante que não vai ter dois iguais no banco
    @Column({ length: 100, unique: true, nullable: false })
    email: string;

    // a senha vai ficar como hash (embaralhada), por isso 255 caracteres
    @Column({ length: 255, nullable: false })
    senha: string;

    // preenchida automaticamente com a data/hora de quando o registro foi criado
    @CreateDateColumn({ name: "created_at" })
    createdAt: Date;

    // atualizada automaticamente toda vez que o registro for salvo de novo
    @UpdateDateColumn({ name: "updated_at" })
    updatedAt: Date;
}