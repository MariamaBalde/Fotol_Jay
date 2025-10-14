import {} from "@prisma/client";
import { UserRepository } from "./UserRepository.js";
import bcrypt from "bcryptjs";
export class UserService {
    userRepository;
    constructor() {
        this.userRepository = new UserRepository();
    }
    async createUser(data) {
        if (data.motDePasse) {
            data.motDePasse = await bcrypt.hash(data.motDePasse, 10);
        }
        return await this.userRepository.create(data);
    }
    async getAllUsers() {
        return await this.userRepository.findAll();
    }
    async getUserById(id) {
        return await this.userRepository.findById(id);
    }
    async updateUser(id, data) {
        if (data.motDePasse) {
            data.motDePasse = await bcrypt.hash(data.motDePasse, 10);
        }
        return await this.userRepository.update(id, data);
    }
    async deleteUser(id) {
        return await this.userRepository.delete(id);
    }
}
//# sourceMappingURL=UserService.js.map