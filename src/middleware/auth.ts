import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { createError, verifyAccessToken } from '../utils';

export interface AuthRequest extends Request {
    user?: { id: string, username: string, role: string }, 
    file?: any
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw createError(401, 'Authentication token required');
        }

        const decoded = verifyAccessToken(token);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError || error instanceof jwt.TokenExpiredError) {
            next(createError(401, 'Invalid or expired token'));
            return;
        }
        next(error);
    }
};