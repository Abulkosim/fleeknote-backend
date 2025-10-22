import rateLimit from 'express-rate-limit';
import { createError } from '../utils/errors';

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 500000, 
    message: 'Too many requests from this IP, please try again after 15 minutes',
    handler: (req, res, next, options) => {
        next(createError(429, options.message));
    },
    standardHeaders: true, 
    legacyHeaders: false, 
});

export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, 
    max: 50000, 
    message: 'Too many login attempts, please try again after an hour',
    handler: (req, res, next, options) => {
        next(createError(429, options.message));
    },
    standardHeaders: true,
    legacyHeaders: false,
}); 