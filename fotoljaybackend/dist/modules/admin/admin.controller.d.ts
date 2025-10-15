import type { Request, Response } from 'express';
export declare class AdminController {
    getDashboardStats(req: Request, res: Response): Promise<void>;
    getUsers(req: Request, res: Response): Promise<void>;
    updateUserStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getPendingProducts(req: Request, res: Response): Promise<void>;
    moderateProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getReports(req: Request, res: Response): Promise<void>;
    processReport(req: Request, res: Response): Promise<void>;
    getModerators(req: Request, res: Response): Promise<void>;
    updateUserRole(req: Request, res: Response): Promise<void>;
    createModerator(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateModeratorStatus(req: Request, res: Response): Promise<void>;
    deleteModerator(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    updateModerator(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getModeratorHistory(req: Request, res: Response): Promise<void>;
    getModeratorRanking(req: Request, res: Response): Promise<void>;
    submitModeratorFeedback(req: Request, res: Response): Promise<void>;
    getVipSettings(req: Request, res: Response): Promise<void>;
    updateVipSetting(req: Request, res: Response): Promise<void>;
    getVipPricing(req: Request, res: Response): Promise<void>;
    createVipPricing(req: Request, res: Response): Promise<void>;
    updateVipPricing(req: Request, res: Response): Promise<void>;
    getVipPromoCodes(req: Request, res: Response): Promise<void>;
    createVipPromoCode(req: Request, res: Response): Promise<void>;
    updateVipPromoCode(req: Request, res: Response): Promise<void>;
    getVipSubscriptions(req: Request, res: Response): Promise<void>;
    createVipSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    extendVipSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    refundVipSubscription(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
    getVipAnalytics(req: Request, res: Response): Promise<void>;
    exportReports(req: Request, res: Response): Promise<Response<any, Record<string, any>> | undefined>;
}
//# sourceMappingURL=admin.controller.d.ts.map