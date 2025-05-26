import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/usuario";
type Params = { id: string };

const usuarioRepository = AppDataSource.getRepository(Usuario);

export const listarUsuarios = async (req: Request, res: Response) => {
    const usuarios = await usuarioRepository.find();
    res.status(200).json(usuarios)
    return;
};

export const obterUsuario = async (req: Request<Params>, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = await usuarioRepository.findOneBy({ id });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    res.status(200).json(usuario)
    return;
};

export const atualizarUsuario = async (req: Request<Params>, res: Response) => {
    const id = parseInt(req.params.id);
    const { nome, email } = req.body;
    try {
        const usuario = await usuarioRepository.findOneBy({ id });
        if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
        usuario.nome = nome || usuario.nome;
        usuario.email = email || usuario.email;
        await usuarioRepository.save(usuario);
        res.status(200).json(usuario)
        return;
    } catch (error) {
        res.status(400).json({ error: "Erro na atualização" })
        return;
    }
};

export const deletarUsuario = async (req: Request<Params>, res: Response) => {
    const id = parseInt(req.params.id);
    const usuario = await usuarioRepository.findOneBy({ id });
    if (!usuario) return res.status(404).json({ error: "Usuário não encontrado" });
    await usuarioRepository.remove(usuario);
    res.status(204).send()

};