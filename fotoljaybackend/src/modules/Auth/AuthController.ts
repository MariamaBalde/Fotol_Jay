import type { Request, Response } from 'express';
import { AuthService } from './AuthService.js';


export class AuthController {
        private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response) {
    try {
      const result = await this.authService.register(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, motDePasse } = req.body;
      const result = await this.authService.login(email, motDePasse);
      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({ error: error.message });
    }
  }

  async creerAdministrateur(req: Request, res: Response) {
    try {
      const result = await this.authService.creerAdministrateur(req.body);
      return res.status(201).json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}


