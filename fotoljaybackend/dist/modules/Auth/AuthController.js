import { AuthService } from './AuthService.js';
export class AuthController {
    authService;
    constructor() {
        this.authService = new AuthService();
    }
    async register(req, res) {
        try {
            const result = await this.authService.register(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
    async login(req, res) {
        try {
            const { email, motDePasse } = req.body;
            const result = await this.authService.login(email, motDePasse);
            return res.status(200).json(result);
        }
        catch (error) {
            return res.status(401).json({ error: error.message });
        }
    }
    async creerAdministrateur(req, res) {
        try {
            const result = await this.authService.creerAdministrateur(req.body);
            return res.status(201).json(result);
        }
        catch (error) {
            return res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=AuthController.js.map