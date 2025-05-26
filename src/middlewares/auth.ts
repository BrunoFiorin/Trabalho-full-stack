import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

const SECRET_KEY = "sua_chave_secreta";

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        res.status(401).json({ error: "Token não fornecido. Faça login primeiro." })
        return;
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as { id: number };
        res.locals.userId = decoded.id; 
        next();
    } catch (error) {
        res.status(401).json({ error: "Token inválido ou expirado." })
        return;
    }
};