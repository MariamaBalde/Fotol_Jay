import { PrismaClient } from "@prisma/client";
import {} from "../../repository/IRepository.js";
import prisma from "../../config/database.js";
export class UserRepository {
    async findAll() {
        return await prisma.utilisateur.findMany();
    }
    async findById(id) {
        return await prisma.utilisateur.findUnique({
            where: { id }
        });
    }
    async findByEmail(email) {
        return await prisma.utilisateur.findUnique({
            where: { email }
        });
    }
    async create(data) {
        return await prisma.utilisateur.create({
            data: {
                ...data,
                dateCreation: new Date(),
                dateMiseAJour: new Date()
            }
        });
    }
    async update(id, data) {
        return await prisma.utilisateur.update({
            where: { id },
            data
        });
    }
    async delete(id) {
        return await prisma.utilisateur.delete({
            where: { id }
        });
    }
}
//# sourceMappingURL=UserRepository.js.map