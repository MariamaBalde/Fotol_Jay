import { IsOptional, IsString, IsNumber, IsEnum, IsArray } from 'class-validator';
export var ModerationDecision;
(function (ModerationDecision) {
    ModerationDecision["APPROUVER"] = "APPROUVER";
    ModerationDecision["REFUSER"] = "REFUSER";
    ModerationDecision["ATTENTE"] = "ATTENTE";
})(ModerationDecision || (ModerationDecision = {}));
export class PendingProductDto {
    @IsNumber()
    id;
    @IsString()
    titre;
    @IsString()
    description;
    @IsArray()
    images;
    @IsString()
    categorie;
    @IsString()
    etat;
    @IsNumber()
    prix;
    @IsString()
    vendeurNom;
    @IsString()
    vendeurEmail;
    @IsString()
    dateCreation;
    @IsOptional()
    @IsNumber()
    vues;
}
export class ModerationDecisionDto {
    @IsEnum(ModerationDecision)
    decision;
    @IsOptional()
    @IsString()
    commentaire;
}
export class ModerationResultDto {
    @IsString()
    message;
    @IsString()
    status;
    @IsOptional()
    @IsString()
    commentaire;
}
export class ModerationHistoryDto {
    @IsNumber()
    id;
    @IsNumber()
    productId;
    @IsString()
    productTitle;
    @IsEnum(ModerationDecision)
    decision;
    @IsOptional()
    @IsString()
    commentaire;
    @IsString()
    moderatorName;
    @IsString()
    createdAt;
}
//# sourceMappingURL=moderation.dto.js.map