import { IsOptional, IsString, IsNumber, IsEnum, IsEmail } from 'class-validator';
export var UserRole;
(function (UserRole) {
    UserRole["UTILISATEUR"] = "UTILISATEUR";
    UserRole["MODERATEUR"] = "MODERATEUR";
    UserRole["ADMINISTRATEUR"] = "ADMINISTRATEUR";
})(UserRole || (UserRole = {}));
export var UserStatus;
(function (UserStatus) {
    UserStatus["ACTIF"] = "ACTIF";
    UserStatus["SUSPENDU"] = "SUSPENDU";
    UserStatus["SUPPRIME"] = "SUPPRIME";
})(UserStatus || (UserStatus = {}));
export class UserFiltersDto {
    @IsOptional()
    @IsString()
    search;
    @IsOptional()
    @IsEnum(UserRole)
    role;
    @IsOptional()
    @IsEnum(UserStatus)
    status;
    @IsOptional()
    @IsNumber()
    page = 1;
    @IsOptional()
    @IsNumber()
    limit = 20;
}
export class UpdateUserStatusDto {
    @IsEnum(UserStatus)
    status;
}
export class CreateModeratorDto {
    @IsString()
    nom;
    @IsEmail()
    email;
    @IsString()
    telephone;
    @IsOptional()
    @IsString()
    permissions;
}
export class UserDto {
    @IsNumber()
    id;
    @IsString()
    nom;
    @IsEmail()
    email;
    @IsString()
    telephone;
    @IsEnum(UserRole)
    role;
    @IsEnum(UserStatus)
    status;
    @IsOptional()
    @IsNumber()
    productsCount;
    @IsOptional()
    @IsString()
    lastLogin;
    @IsOptional()
    @IsString()
    createdAt;
}
export class UsersResponseDto {
    users;
    total;
    page;
    limit;
}
//# sourceMappingURL=user-management.dto.js.map