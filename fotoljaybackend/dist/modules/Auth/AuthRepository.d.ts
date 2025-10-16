import { Role } from "@prisma/client";
import type { Utilisateur } from "@prisma/client";
export declare class AuthRepository {
    findByEmail(email: string): Promise<Utilisateur | null>;
    create(data: {
        email: string;
        motDePasse: string;
        prenom: string;
        nom: string;
        telephone: string;
        localisation?: string;
        role?: Role;
    }): Promise<Utilisateur>;
}
//# sourceMappingURL=AuthRepository.d.ts.map