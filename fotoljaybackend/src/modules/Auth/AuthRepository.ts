import { PrismaClient, Role } from "@prisma/client";
import type { Utilisateur } from "@prisma/client";
import prisma from "../../config/database.js";

export class AuthRepository {
  async findByEmail(email: string): Promise<Utilisateur | null> {
    return await prisma.utilisateur.findUnique({
      where: { email },
    });
  }

  async create(
    data: {
      email: string;
      motDePasse: string;
      prenom: string;
      nom: string;
      telephone: string;
      localisation?: string;
      role?: Role;
    }
  ): Promise<Utilisateur> {
    return await prisma.utilisateur.create({
      data: {
        ...data,
        dateCreation: new Date(),
        dateMiseAJour: new Date(),
      },
    });
  }
}
