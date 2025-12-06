import { Request, Response, NextFunction } from 'express';
import { ZodObject, ZodError } from 'zod';
import { createError } from '../utils/errors';

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
                const errorMessages = error.issues.map((err) => ({
                    field: err.path.join('.'),
                    message: err.message
                }));
                const message = errorMessages
                    .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
                    .join(', ');

                return next(createError(400, `Validation error: ${message}`));
            }

            next(error);
        }
    };
};
