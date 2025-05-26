import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Livro } from "../entities/livro";
import { Categoria } from "../entities/categoria"; 

type Params = { id: string };

const livroRepository = AppDataSource.getRepository(Livro);
const categoriaRepository = AppDataSource.getRepository(Categoria);

export const criarLivro = async (req: Request, res: Response) => {
    const { titulo, autor, categorias } = req.body; 

    try {
        const categoriasEncontradas = await categoriaRepository.findByIds(categorias || []);

        const livro = new Livro();
        livro.titulo = titulo;
        livro.autor = autor;
        livro.categorias = categoriasEncontradas; 

        await livroRepository.save(livro);

        res.status(201).json({
            ...livro,
            categorias: livro.categorias.map(c => ({ id: c.id, nome: c.nome }))
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar livro" });
    }
};

export const listarLivros = async (req: Request, res: Response) => {
    try {
        const livros = await livroRepository.find({ 
            relations: ["categorias"]
        });

        const livrosFormatados = livros.map(livro => ({
            ...livro,
            categorias: livro.categorias.map(c => ({ id: c.id, nome: c.nome }))
        }));

        res.status(200).json(livrosFormatados);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar livros" });
    }
};

export const atualizarLivro = async (req: Request<Params>, res: Response) => {
    const id = parseInt(req.params.id);
    const { titulo, categorias } = req.body;

    try {
        const livro = await livroRepository.findOne({ 
            where: { id },
            relations: ["categorias"] 
        });

        if (!livro) {
            res.status(404).json({ error: "Livro não encontrado" })
            return;
        }

        livro.titulo = titulo || livro.titulo;

        if (categorias) {
            const categoriasEncontradas = await categoriaRepository.findByIds(categorias);
            livro.categorias = categoriasEncontradas;
        }

        await livroRepository.save(livro);

        res.status(200).json({
            ...livro,
            categorias: livro.categorias.map(c => ({ id: c.id, nome: c.nome }))
        });
    } catch (error) {
        res.status(500).json({ error: "Erro ao atualizar livro" });
    }
};