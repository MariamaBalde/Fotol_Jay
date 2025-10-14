import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './AuthMiddleware.js';
import type { ZodSchema } from 'zod';

export function ValidateRequest(schema: ZodSchema) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      console.log('Validation error:', error.errors);
      return res.status(400).json({
        error: 'Validation échouée',
        details: error.errors,
      });
    }
  };
}