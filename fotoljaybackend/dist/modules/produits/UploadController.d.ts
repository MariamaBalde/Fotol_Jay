import type { Response } from 'express';
import type { AuthRequest } from '../../middleware/AuthMiddleware.js';
export declare class UploadController {
    uploadImagesProduit(req: AuthRequest, res: Response): Promise<Response>;
    uploadPhotoProfil(req: AuthRequest, res: Response): Promise<Response>;
}
export declare const controleurUpload: UploadController;
//# sourceMappingURL=UploadController.d.ts.map