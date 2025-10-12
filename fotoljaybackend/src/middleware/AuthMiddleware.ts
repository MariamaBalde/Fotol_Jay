import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/jwt.js';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

export function AuthMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Token manquant' });
    }

    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token invalide' });
  }
}