import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, JoinTable } from "typeorm";
import { Emprestimo } from "./emprestimo";
import { Categoria } from "./categoria";

@Entity()
export class Livro {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column("varchar")
    titulo!: string;

    @Column("varchar")
    autor!: string;

    @Column("boolean", { default: true })
    disponivel!: boolean;

    @OneToMany(() => Emprestimo, emprestimo => emprestimo.livro)
    emprestimos!: Emprestimo[];

    @ManyToMany(() => Categoria, categoria => categoria.livros)
    @JoinTable()
    categorias!: Categoria[];
}