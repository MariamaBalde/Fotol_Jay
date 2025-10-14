import type { Response, NextFunction } from 'express';
import type { AuthRequest } from './AuthMiddleware.js';
export declare function RoleMiddleware(...allowedRoles: string[]): (req: AuthRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=RoleMiddleware.d.ts.map