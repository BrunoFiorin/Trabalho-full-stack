import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Categoria } from "../entities/categoria";
type Params = { id: string };

const categoriaRepository = AppDataSource.getRepository(Categoria);

export const criarCategoria = async (req: Request, res: Response) => {
    const { nome } = req.body;
    const categoria = new Categoria();
    categoria.nome = nome;
    await categoriaRepository.save(categoria);
    res.status(201).json(categoria)
    return;
};

export const listarCategorias = async (req: Request, res: Response) => {
    const categorias = await categoriaRepository.find();
    res.status(200).json(categorias)
    return;
};

export const atualizarCategoria = async (req: Request<Params>, res: Response) => {
    const id = parseInt(req.params.id);
    const { nome } = req.body;
    try {
        const categoria = await categoriaRepository.findOneBy({ id });
        if (!categoria) return res.status(404).json({ error: "Categoria não encontrada" });
        categoria.nome = nome || categoria.nome;
        await categoriaRepository.save(categoria);
        res.status(200).json(categoria)
        return;
    } catch (error) {
        res.status(400).json({ error: "Erro na atualização" })
        return;
    }
};

export const deletarCategoria = async (req: Request<Params>, res: Response) => {
    const id = parseInt(req.params.id);
    const categoria = await categoriaRepository.findOneBy({ id });
    if (!categoria) return res.status(404).json({ error: "Categoria não Encontrada" });
    await categoriaRepository.remove(categoria);
    res.status(204).send()
};
