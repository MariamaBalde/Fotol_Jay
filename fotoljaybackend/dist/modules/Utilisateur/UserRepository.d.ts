import { type Utilisateur } from "@prisma/client";
import { type IRepository } from "../../repository/IRepository.js";
export declare class UserRepository implements IRepository<Utilisateur> {
    findAll(): Promise<Utilisateur[]>;
    findById(id: string): Promise<Utilisateur | null>;
    findByEmail(email: string): Promise<Utilisateur | null>;
    create(data: Omit<Utilisateur, "id" | "dateCreation" | "dateMiseAJour">): Promise<Utilisateur>;
    update(id: string, data: Partial<Utilisateur>): Promise<Utilisateur>;
    delete(id: string): Promise<Utilisateur>;
}
//# sourceMappingURL=UserRepository.d.ts.map