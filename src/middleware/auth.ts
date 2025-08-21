import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError } from '../utils/errors';

export interface AuthRequest extends Request {
    user?: { id: string, username: string }, 
    file?: any
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw createError(401, 'Authentication token required');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, username: string };
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(createError(401, 'Invalid token'));
            return;
        }
        next(error);
    }
};