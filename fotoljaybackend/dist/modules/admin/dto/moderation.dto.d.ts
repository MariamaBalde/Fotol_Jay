export declare enum ModerationDecision {
    APPROUVER = "APPROUVER",
    REFUSER = "REFUSER",
    ATTENTE = "ATTENTE"
}
export declare class PendingProductDto {
    id: number;
    titre: string;
    description: string;
    images: string[];
    categorie: string;
    etat: string;
    prix: number;
    vendeurNom: string;
    vendeurEmail: string;
    dateCreation: string;
    vues?: number;
}
export declare class ModerationDecisionDto {
    decision: ModerationDecision;
    commentaire?: string;
}
export declare class ModerationResultDto {
    message: string;
    status: string;
    commentaire?: string;
}
export declare class ModerationHistoryDto {
    id: number;
    productId: number;
    productTitle: string;
    decision: ModerationDecision;
    commentaire?: string;
    moderatorName: string;
    createdAt: string;
}
//# sourceMappingURL=moderation.dto.d.ts.map