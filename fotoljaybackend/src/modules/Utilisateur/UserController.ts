import type { Request, Response } from "express";
import { UserService } from "./UserService.js";
import { registerSchema } from "../Auth/AuthValidation.js";

export class UserController {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await this.userService.getAllUsers();
            return res.status(200).json(users);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID manquant" });
            }
            const user = await this.userService.getUserById(id);
            if (!user) {
                return res.status(404).json({ error: "Utilisateur non trouvé" });
            }
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID manquant" });
            }
            const user = await this.userService.updateUser(id, req.body);
            return res.status(200).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ error: "ID manquant" });
            }
            await this.userService.deleteUser(id);
            return res.status(204).send();
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }

    async createUser(req: Request, res: Response) {
        try {
            const user = await this.userService.createUser(req.body);
            return res.status(201).json(user);
        } catch (error: any) {
            return res.status(500).json({ error: error.message });
        }
    }
}
