import { AuthRepository } from "./AuthRepository.js";
import bcrypt from "bcryptjs";
import { generateToken } from '../../config/jwt.js';
export class AuthService {
    authRepository;
    constructor() {
        this.authRepository = new AuthRepository();
    }
    async register(data) {
        const existingUser = await this.authRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé');
        }
        const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
        const user = await this.authRepository.create({
            ...data,
            motDePasse: hashedPassword,
        });
        const token = generateToken(user.id, user.role);
        const { motDePasse: _, ...utilisateur } = user;
        return { utilisateur, token };
    }
    async login(email, motDePasse) {
        const user = await this.authRepository.findByEmail(email);
        if (!user) {
            throw new Error('Email ou mot de passe incorrect');
        }
        const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse);
        if (!isValidPassword) {
            throw new Error('Email ou mot de passe incorrect');
        }
        const token = generateToken(user.id, user.role);
        const { motDePasse: _, ...utilisateur } = user;
        return { utilisateur, token };
    }
    async creerAdministrateur(data) {
        const existingUser = await this.authRepository.findByEmail(data.email);
        if (existingUser) {
            throw new Error('Cet email est déjà utilisé');
        }
        const hashedPassword = await bcrypt.hash(data.motDePasse, 10);
        const user = await this.authRepository.create({
            ...data,
            motDePasse: hashedPassword,
            role: 'ADMINISTRATEUR', // Force le rôle administrateur
        });
        const token = generateToken(user.id, user.role);
        const { motDePasse: _, ...utilisateur } = user;
        return { utilisateur, token };
    }
}
//# sourceMappingURL=AuthService.js.map