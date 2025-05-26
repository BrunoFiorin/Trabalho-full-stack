import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { Usuario } from "../entities/usuario";
import * as bcrypt from "bcrypt";

const usuarioRepository = AppDataSource.getRepository(Usuario);
const SECRET_KEY = "sua_chave_secreta";

export const login = async (req: Request, res: Response) => {
    const { email, senha } = req.body;

    try {
        const usuario = await usuarioRepository.findOne({ 
            where: { email },
            select: ["id", "email", "senha"] 
        });

        if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
            res.status(401).json({ error: "Credenciais inválidas" })
            return;
        }

        const token = jwt.sign({ id: usuario.id }, SECRET_KEY, { expiresIn: "1h" });
        res.status(200).json({ token });
    } catch (error) {
        res.status(500).json({ error: "Erro no login" });
    }
};

export const registro = async (req: Request, res: Response) => {
    const { nome, email, senha } = req.body;

    try {
        // Verifica se o e-mail já está cadastrado
        const usuarioExistente = await usuarioRepository.findOneBy({ email });
        if (usuarioExistente) {
            res.status(400).json({ error: "E-mail já cadastrado." })
            return;
        }

        // Cria o usuário 
        const novoUsuario = usuarioRepository.create({ nome, email, senha });
        await usuarioRepository.save(novoUsuario);

        // Retorna os dados do usuário
        res.status(201).json({
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email
        });
    } catch (error) {
        res.status(500).json({ error: "Erro no registro." });
    }
};