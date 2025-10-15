export declare enum UserRole {
    UTILISATEUR = "UTILISATEUR",
    MODERATEUR = "MODERATEUR",
    ADMINISTRATEUR = "ADMINISTRATEUR"
}
export declare enum UserStatus {
    ACTIF = "ACTIF",
    SUSPENDU = "SUSPENDU",
    SUPPRIME = "SUPPRIME"
}
export declare class UserFiltersDto {
    search?: string;
    role?: UserRole;
    status?: UserStatus;
    page?: number;
    limit?: number;
}
export declare class UpdateUserStatusDto {
    status: UserStatus;
}
export declare class CreateModeratorDto {
    nom: string;
    email: string;
    telephone: string;
    permissions?: string;
}
export declare class UserDto {
    id: number;
    nom: string;
    email: string;
    telephone: string;
    role: UserRole;
    status: UserStatus;
    productsCount?: number;
    lastLogin?: string;
    createdAt?: string;
}
export declare class UsersResponseDto {
    users: UserDto[];
    total: number;
    page: number;
    limit: number;
}
//# sourceMappingURL=user-management.dto.d.ts.map