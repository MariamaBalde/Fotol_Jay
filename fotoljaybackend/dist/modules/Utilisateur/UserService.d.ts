import { type Utilisateur } from "@prisma/client";
export declare class UserService {
    private userRepository;
    constructor();
    createUser(data: Omit<Utilisateur, "id" | "dateCreation" | "dateMiseAJour">): Promise<Utilisateur>;
    getAllUsers(): Promise<Utilisateur[]>;
    getUserById(id: string): Promise<Utilisateur | null>;
    updateUser(id: string, data: Partial<Utilisateur>): Promise<Utilisateur>;
    deleteUser(id: string): Promise<Utilisateur>;
}
//# sourceMappingURL=UserService.d.ts.map