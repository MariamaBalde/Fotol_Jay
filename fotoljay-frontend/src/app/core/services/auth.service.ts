import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import {
  Utilisateur,
  ReponseAuth,
  DonneesInscription,
  DonneesConnexion,
} from '../models/utilisateur.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private utilisateurSubject = new BehaviorSubject<Utilisateur | null>(null);
  public utilisateur$ = this.utilisateurSubject.asObservable();
  private readonly TOKEN_KEY = 'auth_token';

  constructor(private http: HttpClient, private router: Router) {
    // Charger l'utilisateur depuis le localStorage au démarrage
    this.chargerUtilisateurDepuisStorage();
  }

  /**
   * Vider complètement la session utilisateur
   */
  private viderSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('utilisateur');
    this.utilisateurSubject.next(null);
  }

  /**
   * Inscription d'un nouvel utilisateur
   */
  inscrire(donnees: DonneesInscription): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.apiUrl}/inscription`, donnees).pipe(
      tap((reponse) => {
        this.sauvegarderSession(reponse);
      })
    );
  }

  /**
   * Connexion d'un utilisateur existant
   */
  connecter(donnees: DonneesConnexion): Observable<ReponseAuth> {
    return this.http.post<ReponseAuth>(`${this.apiUrl}/login`, donnees).pipe(
      tap((reponse) => {
        this.sauvegarderSession(reponse);
      })
    );
  }

  /**
   * Déconnexion de l'utilisateur
   */
  deconnecter(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem('utilisateur');
    this.utilisateurSubject.next(null);
    this.router.navigate(['/auth/connexion']);
  }

  /**
   * Sauvegarder la session dans le localStorage
   */
  private sauvegarderSession(reponse: ReponseAuth): void {
    if (!reponse || !reponse.token || !reponse.utilisateur) {
      console.error('Réponse invalide du serveur:', reponse);
      return;
    }

    localStorage.setItem(this.TOKEN_KEY, reponse.token);

    // Create user object with default values for missing fields
    const utilisateur: Utilisateur = {
      id: reponse.utilisateur.id,
      email: reponse.utilisateur.email,
      prenom: reponse.utilisateur.prenom || '',
      nom: reponse.utilisateur.nom || '',
      telephone: reponse.utilisateur.telephone || '',
      role: reponse.utilisateur.role || 'UTILISATEUR',
      dateCreation: reponse.utilisateur.dateCreation ? new Date(reponse.utilisateur.dateCreation) : new Date(),
      photoProfil: reponse.utilisateur.photoProfil,
      localisation: reponse.utilisateur.localisation,
      finVip: reponse.utilisateur.finVip ? new Date(reponse.utilisateur.finVip) : undefined
    };

    localStorage.setItem('utilisateur', JSON.stringify(utilisateur));
    this.utilisateurSubject.next(utilisateur);
  }

  /**
   * Charger l'utilisateur depuis le localStorage
   */
  private chargerUtilisateurDepuisStorage(): void {
    const utilisateurJson = localStorage.getItem('utilisateur');
    const token = this.obtenirToken();

    if (utilisateurJson && token) {
      try {
        const utilisateur = JSON.parse(utilisateurJson);
        // Vérifier si le token est valide avant de charger l'utilisateur
        if (this.estConnecte()) {
          this.utilisateurSubject.next(utilisateur);
        } else {
          // Token expiré, vider la session
          this.viderSession();
        }
      } catch (erreur) {
        console.error('Erreur lors du chargement de l\'utilisateur:', erreur);
        this.viderSession();
      }
    } else {
      // Pas de données utilisateur ou token, s'assurer que la session est vide
      this.viderSession();
    }
  }

  /**
   * Obtenir le token JWT
   */
  obtenirToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Vérifier si l'utilisateur est connecté
   */
  estConnecte(): boolean {
    const token = this.obtenirToken();
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    } catch (e) {
      return false;
    }
  }

  /**
   * Obtenir l'utilisateur actuellement connecté
   */
  obtenirUtilisateurActuel(): Utilisateur | null {
    return this.utilisateurSubject.value;
  }

  /**
   * Vérifier si l'utilisateur est VIP
   */
  estVIP(): boolean {
    const utilisateur = this.obtenirUtilisateurActuel();
    if (!utilisateur || !utilisateur.finVip) return false;

    const maintenant = new Date();
    const finVip = new Date(utilisateur.finVip);
    return finVip > maintenant;
  }

  /**
   * Vérifier si l'utilisateur est modérateur ou administrateur
   */
  estModerateur(): boolean {
    const utilisateur = this.obtenirUtilisateurActuel();
    return (
      utilisateur?.role === 'MODERATEUR' || utilisateur?.role === 'ADMINISTRATEUR'
    );
  }

  /**
   * Vérifier si l'utilisateur est administrateur
   */
  estAdministrateur(): boolean {
    const utilisateur = this.obtenirUtilisateurActuel();
    return utilisateur?.role === 'ADMINISTRATEUR';
  }
}