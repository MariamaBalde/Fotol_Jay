import type { FiltresProduits } from './ProduitsRepository.js';
export declare class ProduitsService {
    private repository;
    private serviceNotifications;
    constructor();
    creerProduit(donnees: CreateProduitDto, utilisateurId: string, images: ImageProduitDto[]): Promise<({
        utilisateur: {
            id: string;
            email: string;
            prenom: string;
            nom: string;
            telephone: string;
            localisation: string | null;
            role: import("@prisma/client").$Enums.Role;
            finVip: Date | null;
        };
        images: {
            id: string;
            dateCreation: Date;
            url: string;
            urlMiniature: string | null;
            ordre: number;
            produitId: string;
        }[];
    } & {
        id: string;
        localisation: string | null;
        dateCreation: Date;
        dateMiseAJour: Date;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        statut: import("@prisma/client").$Enums.StatutProduit;
        raisonRefus: string | null;
        vues: number;
        nombreContacts: number;
        utilisateurId: string;
        dateExpiration: Date;
    }) | null>;
    obtenirProduit(id: string, incrementerVue?: boolean): Promise<{
        utilisateur: {
            id: string;
            email: string;
            prenom: string;
            nom: string;
            telephone: string;
            localisation: string | null;
            role: import("@prisma/client").$Enums.Role;
            finVip: Date | null;
        };
        images: {
            id: string;
            dateCreation: Date;
            url: string;
            urlMiniature: string | null;
            ordre: number;
            produitId: string;
        }[];
    } & {
        id: string;
        localisation: string | null;
        dateCreation: Date;
        dateMiseAJour: Date;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        statut: import("@prisma/client").$Enums.StatutProduit;
        raisonRefus: string | null;
        vues: number;
        nombreContacts: number;
        utilisateurId: string;
        dateExpiration: Date;
    }>;
    listerProduits(filtres: FiltresProduits): Promise<{
        produits: ({
            utilisateur: {
                id: string;
                prenom: string;
                nom: string;
                telephone: string;
                localisation: string | null;
                role: import("@prisma/client").$Enums.Role;
                finVip: Date | null;
            };
            images: {
                id: string;
                dateCreation: Date;
                url: string;
                urlMiniature: string | null;
                ordre: number;
                produitId: string;
            }[];
        } & {
            id: string;
            localisation: string | null;
            dateCreation: Date;
            dateMiseAJour: Date;
            titre: string;
            description: string;
            prix: number;
            categorie: string;
            etat: string;
            statut: import("@prisma/client").$Enums.StatutProduit;
            raisonRefus: string | null;
            vues: number;
            nombreContacts: number;
            utilisateurId: string;
            dateExpiration: Date;
        })[];
        pagination: {
            page: number;
            limite: number;
            total: number;
            totalPages: number;
        };
    }>;
    obtenirMesProduits(utilisateurId: string, page?: number, limite?: number): Promise<{
        produits: ({
            utilisateur: {
                id: string;
                prenom: string;
                nom: string;
                telephone: string;
                localisation: string | null;
                role: import("@prisma/client").$Enums.Role;
                finVip: Date | null;
            };
            images: {
                id: string;
                dateCreation: Date;
                url: string;
                urlMiniature: string | null;
                ordre: number;
                produitId: string;
            }[];
        } & {
            id: string;
            localisation: string | null;
            dateCreation: Date;
            dateMiseAJour: Date;
            titre: string;
            description: string;
            prix: number;
            categorie: string;
            etat: string;
            statut: import("@prisma/client").$Enums.StatutProduit;
            raisonRefus: string | null;
            vues: number;
            nombreContacts: number;
            utilisateurId: string;
            dateExpiration: Date;
        })[];
        pagination: {
            page: number;
            limite: number;
            total: number;
            totalPages: number;
        };
    }>;
    modifierProduit(id: string, utilisateurId: string, donnees: {
        titre?: string;
        description?: string;
        prix?: number;
        categorie?: string;
        etat?: string;
    }): Promise<{
        utilisateur: {
            id: string;
            prenom: string;
            nom: string;
            telephone: string;
            localisation: string | null;
        };
        images: {
            id: string;
            dateCreation: Date;
            url: string;
            urlMiniature: string | null;
            ordre: number;
            produitId: string;
        }[];
    } & {
        id: string;
        localisation: string | null;
        dateCreation: Date;
        dateMiseAJour: Date;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        statut: import("@prisma/client").$Enums.StatutProduit;
        raisonRefus: string | null;
        vues: number;
        nombreContacts: number;
        utilisateurId: string;
        dateExpiration: Date;
    }>;
    supprimerProduit(id: string, utilisateurId: string, role: string): Promise<{
        id: string;
        localisation: string | null;
        dateCreation: Date;
        dateMiseAJour: Date;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        statut: import("@prisma/client").$Enums.StatutProduit;
        raisonRefus: string | null;
        vues: number;
        nombreContacts: number;
        utilisateurId: string;
        dateExpiration: Date;
    }>;
    listerProduitsEnAttente(): Promise<({
        utilisateur: {
            id: string;
            email: string;
            prenom: string;
            nom: string;
        };
        images: {
            id: string;
            dateCreation: Date;
            url: string;
            urlMiniature: string | null;
            ordre: number;
            produitId: string;
        }[];
    } & {
        id: string;
        localisation: string | null;
        dateCreation: Date;
        dateMiseAJour: Date;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        statut: import("@prisma/client").$Enums.StatutProduit;
        raisonRefus: string | null;
        vues: number;
        nombreContacts: number;
        utilisateurId: string;
        dateExpiration: Date;
    })[]>;
    modererProduit(id: string, statut: 'APPROUVE' | 'REFUSE', raisonRefus?: string): Promise<{
        utilisateur: {
            id: string;
            email: string;
            motDePasse: string;
            prenom: string;
            nom: string;
            telephone: string;
            photoProfil: string | null;
            localisation: string | null;
            role: import("@prisma/client").$Enums.Role;
            finVip: Date | null;
            dateCreation: Date;
            dateMiseAJour: Date;
        };
    } & {
        id: string;
        localisation: string | null;
        dateCreation: Date;
        dateMiseAJour: Date;
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        statut: import("@prisma/client").$Enums.StatutProduit;
        raisonRefus: string | null;
        vues: number;
        nombreContacts: number;
        utilisateurId: string;
        dateExpiration: Date;
    }>;
    gererProduitsExpires(): Promise<{
        message: string;
        produits?: undefined;
    } | {
        message: string;
        produits: ({
            utilisateur: {
                id: string;
                email: string;
                prenom: string;
                nom: string;
            };
        } & {
            id: string;
            localisation: string | null;
            dateCreation: Date;
            dateMiseAJour: Date;
            titre: string;
            description: string;
            prix: number;
            categorie: string;
            etat: string;
            statut: import("@prisma/client").$Enums.StatutProduit;
            raisonRefus: string | null;
            vues: number;
            nombreContacts: number;
            utilisateurId: string;
            dateExpiration: Date;
        })[];
    }>;
    enregistrerContact(id: string): Promise<{
        message: string;
    }>;
}
interface CreateProduitDto {
    titre: string;
    description: string;
    prix: number;
    categorie: string;
    etat: string;
    localisation?: string;
}
interface ImageProduitDto {
    url: string;
    urlMiniature?: string;
    ordre: number;
}
export {};
//# sourceMappingURL=ProduitsService.d.ts.map