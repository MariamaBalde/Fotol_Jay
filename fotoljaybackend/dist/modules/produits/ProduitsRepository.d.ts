import { StatutProduit, type Produit, Prisma } from '@prisma/client';
export interface FiltresProduits {
    categorie?: string | undefined;
    prixMin?: number | undefined;
    prixMax?: number | undefined;
    etat?: string | undefined;
    recherche?: string | undefined;
    page?: number;
    limite?: number;
    statut?: StatutProduit;
    utilisateurId?: string;
}
export declare class ProduitsRepository {
    creer(donnees: {
        titre: string;
        description: string;
        prix: number;
        categorie: string;
        etat: string;
        localisation?: string;
        utilisateurId: string;
        dateExpiration: Date;
        images?: {
            url: string;
            urlMiniature?: string;
            ordre: number;
        }[];
    }): Promise<{
        utilisateur: {
            id: string;
            email: string;
            prenom: string;
            nom: string;
            telephone: string;
            localisation: string | null;
            role: import("@prisma/client").$Enums.Role;
        };
        images: {
            id: string;
            dateCreation: Date;
            url: string;
            produitId: string;
            urlMiniature: string | null;
            ordre: number;
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
    ajouterImages(produitId: string, images: {
        url: string;
        urlMiniature?: string;
        ordre: number;
    }[]): Promise<Prisma.BatchPayload>;
    trouverParId(id: string): Promise<({
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
            produitId: string;
            urlMiniature: string | null;
            ordre: number;
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
    lister(filtres: FiltresProduits): Promise<{
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
                produitId: string;
                urlMiniature: string | null;
                ordre: number;
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
    mettreAJour(id: string, donnees: Partial<Produit>): Promise<{
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
            produitId: string;
            urlMiniature: string | null;
            ordre: number;
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
    supprimer(id: string): Promise<{
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
    incrementerVues(id: string): Promise<{
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
    incrementerContacts(id: string): Promise<{
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
    listerEnAttente(): Promise<{
        id: string;
        titre: string;
        description: string;
        categorie: string;
        etat: string;
        prix: number;
        vendeurNom: string;
        vendeurTelephone: string;
        vendeurEmail: string;
        dateCreation: string;
        vues: number;
        images: string[];
    }[]>;
    moderer(id: string, statut: StatutProduit, raisonRefus?: string): Promise<{
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
            statutModerateur: string | null;
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
    trouverExpires(): Promise<({
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
    })[]>;
    marquerCommeExpire(ids: string[]): Promise<Prisma.BatchPayload>;
}
//# sourceMappingURL=ProduitsRepository.d.ts.map