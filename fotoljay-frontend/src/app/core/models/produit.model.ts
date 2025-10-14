export interface Produit {
  id: string;
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  etat: 'NEUF' | 'COMME_NEUF' | 'BON_ETAT' | 'USAGE';
  statut: 'EN_ATTENTE' | 'APPROUVE' | 'REFUSE' | 'EXPIRE';
  raisonRefus?: string;
  vues: number;
  nombreContacts: number;
  utilisateurId: string;
  utilisateur: {
    id: string;
    prenom: string;
    nom: string;
    telephone: string;
    email: string;
    localisation?: string;
    photoProfil?: string; // Add this line
    role: string;
    finVip?: Date;
  };
  images: ImageProduit[];
  dateCreation: Date;
  dateExpiration: Date;
  dateMiseAJour: Date;
}

export interface ImageProduit {
  id: string;
  url: string;
  ordre: number;
}

export interface DonneesCreationProduit {
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  etat: string;
  images: { url: string; ordre: number }[];
}

export interface FiltresProduits {
  categorie?: string;
  prixMin?: number;
  prixMax?: number;
  etat?: string;
  recherche?: string;
  page?: number;
  limite?: number;
}

export interface ReponseProduits {
  produits: Produit[];
  pagination: {
    page: number;
    limite: number;
    total: number;
    totalPages: number;
  };
}