export declare class AuthService {
    private authRepository;
    constructor();
    register(data: {
        email: string;
        motDePasse: string;
        prenom: string;
        nom: string;
        telephone: string;
        localisation?: string;
    }): Promise<{
        utilisateur: {
            id: string;
            email: string;
            prenom: string;
            nom: string;
            telephone: string;
            photoProfil: string | null;
            localisation: string | null;
            role: import("@prisma/client").$Enums.Role;
            finVip: Date | null;
            statutModerateur: string | null;
            dateCreation: Date;
            dateMiseAJour: Date;
        };
        token: string;
    }>;
    login(email: string, motDePasse: string): Promise<{
        utilisateur: {
            id: string;
            email: string;
            prenom: string;
            nom: string;
            telephone: string;
            photoProfil: string | null;
            localisation: string | null;
            role: import("@prisma/client").$Enums.Role;
            finVip: Date | null;
            statutModerateur: string | null;
            dateCreation: Date;
            dateMiseAJour: Date;
        };
        token: string;
    }>;
}
//# sourceMappingURL=AuthService.d.ts.map