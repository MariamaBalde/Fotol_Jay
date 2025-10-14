import { verifyToken } from '../config/jwt.js';
export function AuthMiddleware(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Token manquant' });
        }
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: 'Token invalide' });
    }
}
//# sourceMappingURL=AuthMiddleware.js.map