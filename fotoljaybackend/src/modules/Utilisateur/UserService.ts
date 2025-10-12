import { type Utilisateur } from "@prisma/client";
import { UserRepository } from "./UserRepository.js";
import bcrypt from "bcryptjs";

export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

      async createUser(data: Omit<Utilisateur, "id" | "dateCreation" | "dateMiseAJour">): Promise<Utilisateur> {
        if (data.motDePasse) {
            data.motDePasse = await bcrypt.hash(data.motDePasse, 10);
        }
        return await this.userRepository.create(data);
    }

    async getAllUsers(): Promise<Utilisateur[]> {
        return await this.userRepository.findAll();
    }

    async getUserById(id: string): Promise<Utilisateur | null> {
        return await this.userRepository.findById(id);
    }

    async updateUser(id: string, data: Partial<Utilisateur>): Promise<Utilisateur> {
        if (data.motDePasse) {
          data.motDePasse= await bcrypt.hash(data.motDePasse, 10);
        }
        return await this.userRepository.update(id, data);
    }

    async deleteUser(id: string): Promise<Utilisateur> {
        return await this.userRepository.delete(id);
    }

  
}
