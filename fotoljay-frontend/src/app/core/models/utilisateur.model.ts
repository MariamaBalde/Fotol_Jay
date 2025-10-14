export interface Utilisateur {
  id: string;
  email: string;
  prenom: string;
  nom: string;
  telephone: string;
  photoProfil?: string;
  localisation?: string;
  role: 'UTILISATEUR' | 'VIP' | 'MODERATEUR' | 'ADMINISTRATEUR';
  finVip?: Date;
  dateCreation: Date;
}

export interface ReponseAuth {
  utilisateur: Utilisateur;
  token: string;
}

export interface DonneesInscription {
  email: string;
  motDePasse: string;
  prenom: string;
  nom: string;
  telephone: string;
  localisation?: string;
}

export interface DonneesConnexion {
  email: string;
  motDePasse: string;
}