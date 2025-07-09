import "reflect-metadata"; 
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { listarUsuarios, obterUsuario, atualizarUsuario, deletarUsuario } from './controllers/usuarioController';
import { criarEmprestimo, concluirDevolucao, listarEmprestimos } from './controllers/emprestimoController';
import { RequestHandler } from 'express';
import { authMiddleware } from "./middlewares/auth";
import { login, registro } from "./controllers/authControllers";
import { criarCategoria, listarCategorias, atualizarCategoria, deletarCategoria } from './controllers/categoriaController';

const app: express.Application = express();
app.use(express.json());
app.use(cors());

interface Params {
    id: string;
}

// Rotas de usuário
app.post("/auth/registro", registro); 
app.post("/auth/login", login); 
app.get("/usuarios", listarUsuarios);
app.get("/usuarios/:id", obterUsuario as RequestHandler<Params>);
app.put("/usuarios/:id", atualizarUsuario as RequestHandler<Params>);
app.delete("/usuarios/:id", deletarUsuario as RequestHandler<Params>);

// Rotas de livros
app.post("/livros", criarLivro);
app.get("/livros", listarLivros);
app.get("/livros/:id", obterLivro as RequestHandler<Params>);
app.put("/livros/:id", atualizarLivro as RequestHandler<Params>);
app.delete("/livros/:id", deletarLivro as RequestHandler<Params>);

app.post("/categorias", criarCategoria);
app.get("/categorias", listarCategorias);
app.put("/categorias/:id", atualizarCategoria as RequestHandler<Params>);
app.delete("/categorias/:id", deletarCategoria as RequestHandler<Params>);

// Rotas protegidas
app.post("/emprestimos/", authMiddleware, criarEmprestimo);
app.put("/emprestimos/:id/finalizar", authMiddleware, concluirDevolucao);
app.get("/emprestimos", listarEmprestimos);

AppDataSource.initialize()
    .then(() => {
        console.log("Banco de dados conectado!");

