import type { Request, Response } from 'express';
export declare class AdminController {
    getDashboardStats(req: Request, res: Response): Promise<void>;
    getUsers(req: Request, res: Response): Promise<void>;
    updateUserStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPendingProducts(req: Request, res: Response): Promise<void>;
    moderateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=admin.controller.d.ts.map