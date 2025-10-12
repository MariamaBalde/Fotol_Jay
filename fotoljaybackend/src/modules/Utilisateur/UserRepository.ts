import { PrismaClient, type Utilisateur } from "@prisma/client";
import {type IRepository } from "../../repository/IRepository.js";
import prisma from "../../config/database.ts";

export class UserRepository implements IRepository<Utilisateur> {
    async findAll(): Promise<Utilisateur[]> {
        return await prisma.utilisateur.findMany();
    }

    async findById(id: string): Promise<Utilisateur | null> {
        return await prisma.utilisateur.findUnique({
            where: { id }
        });
    }

    async findByEmail(email: string): Promise<Utilisateur | null> {
        return await prisma.utilisateur.findUnique({
            where: { email }
        });
    }

    async create(data: Omit<Utilisateur, "id" | "dateCreation" | "dateMiseAJour">): Promise<Utilisateur> {
        return await prisma.utilisateur.create({
            data: {
                ...data,
                dateCreation: new Date(),
                dateMiseAJour: new Date()
            }
        });
    }

    async update(id: string, data: Partial<Utilisateur>): Promise<Utilisateur> {
        return await prisma.utilisateur.update({
            where: { id },
            data
        });
    }

    async delete(id: string): Promise<Utilisateur> {
        return await prisma.utilisateur.delete({
            where: { id }
        });
    }
}