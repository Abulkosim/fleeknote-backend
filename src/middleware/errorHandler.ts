import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';
import { ValidationError } from './validate';

export const errorHandler: ErrorRequestHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message
        });
        return;
    }

    if (err instanceof ValidationError) {
        res.status(err.statusCode).json({
            status: 'error',
            message: err.message,
            errors: err.errors
        });
        return;
    }

    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        res.status(400).json({
            status: 'error',
            message: 'Duplicate field value entered'
        });
        return;
    }

    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
        return;
    }

    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            status: 'error',
            message: 'Token expired'
        });
        return;
    }

    if ((err as any).statusCode === 429) {
        res.status(429).json({
            status: 'error',
            message: err.message,
            retryAfter: res.getHeader('Retry-After')
        });
        return;
    }

    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
}; 