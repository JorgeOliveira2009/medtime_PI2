import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata";

// @Entity diz pro TypeORM que essa classe é uma tabela no banco
// o nome "usuarios" é o nome da tabela que vai ser criada no MySQL
@Entity("usuarios")
export class Usuario {
    // id gerado automaticamente pelo banco (AUTO_INCREMENT)
    @PrimaryGeneratedColumn()
    id: number;

    // coluna email — máximo 100 caracteres, único (não pode repetir), obrigatório
    @Column({ length: 100, unique: true, nullable: false })
    email: string; 

    // coluna senha — máximo 255 caracteres (hash bcrypt tem ~60 chars)
    @Column({ length: 255, nullable: false })
    senha: string;
}