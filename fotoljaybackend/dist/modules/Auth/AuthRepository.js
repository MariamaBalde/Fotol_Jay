import { PrismaClient, Role } from "@prisma/client";
import prisma from "../../config/database.js";
export class AuthRepository {
    async findByEmail(email) {
        return await prisma.utilisateur.findUnique({
            where: { email },
        });
    }
    async create(data) {
        return await prisma.utilisateur.create({
            data: {
                ...data,
                dateCreation: new Date(),
                dateMiseAJour: new Date(),
            },
        });
    }
}
//# sourceMappingURL=AuthRepository.js.map