import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from "typeorm";
import { Livro } from "./livro";


@Entity()
export class Categoria {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @ManyToMany(() => Livro, livro => livro.categorias)
    livros!: Livro[];
}
