import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Produit,
  DonneesCreationProduit,
  FiltresProduits,
  ReponseProduits,
} from '../models/produit.model';

@Injectable({
  providedIn: 'root',
})
export class ProduitsService {
  private apiUrl = `${environment.apiUrl}/produits`;

  constructor(private http: HttpClient) {}

  /**
   * Lister les produits avec filtres optionnels
   */
  listerProduits(filtres: FiltresProduits = {}): Observable<ReponseProduits> {
    let params = new HttpParams();

    // Ajouter les paramètres de filtrage
    if (filtres.categorie) {
      params = params.set('categorie', filtres.categorie);
    }
    if (filtres.prixMin !== undefined) {
      params = params.set('prixMin', filtres.prixMin.toString());
    }
    if (filtres.prixMax !== undefined) {
      params = params.set('prixMax', filtres.prixMax.toString());
    }
    if (filtres.etat) {
      params = params.set('etat', filtres.etat);
    }
    if (filtres.recherche) {
      params = params.set('recherche', filtres.recherche);
    }
    if (filtres.page) {
      params = params.set('page', filtres.page.toString());
    }
    if (filtres.limite) {
      params = params.set('limite', filtres.limite.toString());
    }

    return this.http.get<ReponseProduits>(this.apiUrl, { params });
  }

  /**
   * Obtenir les détails d'un produit par son ID
   */
  obtenirProduit(id: string): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  /**
   * Créer un nouveau produit
   */
  creerProduit(donnees: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    return this.http.post<any>(`${this.apiUrl}`, donnees, { headers });
  }

  /**
   * Obtenir mes produits (nécessite authentification)
   */
  obtenirMesProduits(page: number = 1, limite: number = 20): Observable<ReponseProduits> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limite', limite.toString());

    return this.http.get<ReponseProduits>(`${this.apiUrl}/mes-produits/liste`, { params });
  }

  /**
   * Modifier un produit existant
   */
  modifierProduit(
    id: string, 
    donnees: Partial<DonneesCreationProduit>
  ): Observable<{ message: string; produit: Produit }> {
    return this.http.put<{ message: string; produit: Produit }>(
      `${this.apiUrl}/${id}`, 
      donnees
    );
  }

  /**
   * Supprimer un produit
   */
  supprimerProduit(id: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  /**
   * Enregistrer qu'un utilisateur a contacté le vendeur
   */
  enregistrerContact(id: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/${id}/contact`, {});
  }

  /**
   * Construire l'URL complète d'une image
   */
  obtenirUrlImage(cheminRelatif: string): string {
    if (!cheminRelatif) return '';
    
    // Si l'URL commence par http, c'est déjà une URL complète
    if (cheminRelatif.startsWith('http')) {
      return cheminRelatif;
    }
    
    // Sinon, construire l'URL complète
    const baseUrl = environment.apiUrl.replace('/api', '');
    return `${baseUrl}${cheminRelatif}`;
  }

  /**
   * Formater le prix en FCFA
   */
  formaterPrix(prix: number): string {
    return new Intl.NumberFormat('fr-FR').format(prix) + ' FCFA';
  }

  /**
   * Calculer le temps restant avant expiration
   */
  tempsRestant(dateExpiration: Date): string {
    const maintenant = new Date();
    const expiration = new Date(dateExpiration);
    const diff = expiration.getTime() - maintenant.getTime();
    
    if (diff <= 0) return 'Expiré';
    
    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    const heures = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (jours > 0) {
      return `${jours} jour${jours > 1 ? 's' : ''}`;
    }
    return `${heures} heure${heures > 1 ? 's' : ''}`;
  }

  uploadImages(images: File[]): Observable<any> {
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`images`, image);
    });
    return this.http.post(`${this.apiUrl}/upload/images`, formData);
  }
}

/**
 * Produit Data Transfer Object
 */
export interface ProduitDto {
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  etat: string;
  images: {
    url: string;
    urlMiniature?: string;
    ordre: number;
  }[];
}