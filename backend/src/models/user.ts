import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import "reflect-metadata";

@Entity("usuarios")
export class Usuario {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true ,nullable: false })
    email: string; 

    @Column({ length: 255 ,nullable: false})
    senha: string;
}