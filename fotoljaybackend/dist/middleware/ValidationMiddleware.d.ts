import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './AuthMiddleware.js';
import type { ZodSchema } from 'zod';
export declare function ValidateRequest(schema: ZodSchema): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=ValidationMiddleware.d.ts.map