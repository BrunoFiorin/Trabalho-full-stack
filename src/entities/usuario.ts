import { Entity, PrimaryGeneratedColumn, BeforeInsert, Column, OneToMany } from "typeorm";
import { Emprestimo } from "./emprestimo";
import * as bcrypt from "bcrypt";


@Entity()
export class Usuario {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    nome!: string;

    @Column({ unique: true })
    email!: string;

    @OneToMany(() => Emprestimo, emprestimo => emprestimo.usuario)
    emprestimos!: Emprestimo[];

    @Column({ select: false, default: "senha_temporaria" }) 
    senha!: string;

    @BeforeInsert()
    async hashSenha() {
        this.senha = await bcrypt.hash(this.senha, 10);
    }
    @Column({ default: 0 })
    emprestimosAtivos!: number;

}