import { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import { AppError } from '../utils/errors';

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

    // Handle mongoose validation errors
    if (err.name === 'ValidationError') {
        res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: err
        });
        return;
    }

    // Handle mongoose duplicate key errors
    if (err.name === 'MongoServerError' && (err as any).code === 11000) {
        res.status(400).json({
            status: 'error',
            message: 'Duplicate field value entered'
        });
        return;
    }

    // Handle JWT errors
    if (err.name === 'JsonWebTokenError') {
        res.status(401).json({
            status: 'error',
            message: 'Invalid token'
        });
        return;
    }

    // Handle JWT expiration
    if (err.name === 'TokenExpiredError') {
        res.status(401).json({
            status: 'error',
            message: 'Token expired'
        });
        return;
    }

    // Default error
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
}; 