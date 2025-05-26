import { DataSource } from "typeorm";
import { Livro } from "./entities/livro";
import { Usuario } from "./entities/usuario";
import { Emprestimo } from "./entities/emprestimo";
import { Categoria } from "./entities/categoria";

export const AppDataSource = new DataSource({
    type: "postgres", 
    host: "localhost",
    port: 5432, 
    username: "postgres",
    password: "admin",
    database: "biblioteca",
    synchronize: true,
    logging: true,
    entities: [Livro, Usuario, Emprestimo, Categoria],
    migrations: [],
    subscribers: [],
});