import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';

export class ValidationError extends Error {
    public statusCode = 400;
    public errors: Array<{ field: string; message: string }>;

    constructor(zodError: ZodError) {
        super('Validation failed');
        this.name = 'ValidationError';
        
        this.errors = zodError.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message
        }));
    }
}

export const validate = (schema: ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params
            });

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                return next(new ValidationError(error));
            }

            next(error);
        }
    };
};
