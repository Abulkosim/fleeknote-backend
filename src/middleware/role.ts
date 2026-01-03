import { Request, Response, NextFunction } from 'express';
import { createError } from '../utils';
import { AuthRequest } from './auth';

export const role = (...allowedRoles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const role = (req as AuthRequest).user?.role;
      if (!role) {
        throw createError(401, 'Authentication required');
      }
      if (!allowedRoles.includes(role)) {
        throw createError(403, 'You are not authorized to access this resource');
      }
      next();
    } catch (error) {
      next(error);
    }
  }
}