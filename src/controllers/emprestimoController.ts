import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Emprestimo } from "../entities/emprestimo";
import { Usuario } from "../entities/usuario";
import { Livro } from "../entities/livro";

const emprestimoRepository = AppDataSource.getRepository(Emprestimo);
const usuarioRepository = AppDataSource.getRepository(Usuario);
const livroRepository = AppDataSource.getRepository(Livro);


export const criarEmprestimo = async (req: Request, res: Response) => {
    const { livroId, userId } = req.body;

    try {
        const usuario = await usuarioRepository.findOneBy({ id: userId });
        const livro = await livroRepository.findOneBy({ id: livroId });

        if (!usuario || !livro) {
            res.status(404).json({ error: "Usuário ou livro não encontrado" })
            return;
        }

        if (!livro.disponivel) {
            res.status(400).json({ error: "Livro já emprestado" })
            return;
        }

        const emprestimo = new Emprestimo();
        emprestimo.usuario = usuario;
        emprestimo.livro = livro;
        emprestimo.dataDevolucaoPrevista = new Date();
        emprestimo.dataDevolucaoPrevista.setDate(emprestimo.dataDevolucaoPrevista.getDate() + 7);
        emprestimo.ativo = true;

        livro.disponivel = false;
        usuario.emprestimosAtivos += 1; 

        await livroRepository.save(livro);
        await usuarioRepository.save(usuario); 
        await emprestimoRepository.save(emprestimo);

        res.status(201).json(emprestimo);
    } catch (error) {
        res.status(500).json({ error: "Erro ao criar empréstimo" });
    }
};


export const concluirDevolucao = async (req: Request, res: Response) => {
    const { id } = req.params;

    const emprestimoId = parseInt(id);
    if (isNaN(emprestimoId)) {
        res.status(400).json({ error: "ID de empréstimo inválido" })
        return;
    }

    try {
        const emprestimo = await emprestimoRepository.findOne({
            where: { id: emprestimoId },
            relations: ["livro", "usuario"]
        });

        if (!emprestimo) {
            res.status(404).json({ error: "Empréstimo não encontrado" })
            return;
        }

        if (!emprestimo.ativo) {
            res.status(400).json({ error: "Empréstimo já foi finalizado anteriormente" })
            return;
        }

        emprestimo.dataDevolucao = new Date();
        emprestimo.ativo = false;
        emprestimo.livro.disponivel = true;
        emprestimo.usuario.emprestimosAtivos = Math.max(0, emprestimo.usuario.emprestimosAtivos - 1);

        await livroRepository.save(emprestimo.livro);
        await usuarioRepository.save(emprestimo.usuario);
        await emprestimoRepository.save(emprestimo);

        res.status(200).json({
            mensagem: "Devolução concluída com sucesso!",
            dataDevolucao: emprestimo.dataDevolucao
        });

    } catch (error) {
        res.status(500).json({ error: "Erro ao processar devolução" });
    }
};

export const listarEmprestimos = async (req: Request, res: Response) => {
    try {
        const emprestimos = await emprestimoRepository.find({ 
            relations: ["usuario", "livro"],
            where: { ativo: true } 
        });

        const resposta = emprestimos.map(emp => ({
            id: emp.id,
            dataEmprestimo: emp.dataEmprestimo,
            dataDevolucaoPrevista: emp.dataDevolucaoPrevista,
            livro: {
                id: emp.livro.id,
                titulo: emp.livro.titulo,
                disponivel: emp.livro.disponivel
            },
            usuario: {
                id: emp.usuario.id,
                nome: emp.usuario.nome
            }
        }));

        res.status(200).json(resposta);
    } catch (error) {
        res.status(500).json({ error: "Erro ao listar empréstimos" });
    }
};