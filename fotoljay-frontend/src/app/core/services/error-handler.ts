import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface MessageErreur {
  titre: string;
  message: string;
  details?: string;
}

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}

  // Gérer les erreurs HTTP
  gererErreurHttp(erreur: HttpErrorResponse): MessageErreur {
    let messageErreur: MessageErreur = {
      titre: 'Erreur',
      message: 'Une erreur est survenue',
    };

    if (erreur.error instanceof ErrorEvent) {
      // Erreur côté client
      messageErreur.message = 'Erreur de connexion. Vérifiez votre connexion internet.';
      messageErreur.details = erreur.error.message;
    } else {
      // Erreur côté serveur
      switch (erreur.status) {
        case 400:
          messageErreur.titre = 'Données invalides';
          messageErreur.message =
            erreur.error?.erreur || 'Les données fournies sont invalides';
          messageErreur.details = this.extraireDetailsValidation(erreur);
          break;

        case 401:
          messageErreur.titre = 'Non autorisé';
          messageErreur.message =
            erreur.error?.erreur || 'Email ou mot de passe incorrect';
          break;

        case 403:
          messageErreur.titre = 'Accès refusé';
          messageErreur.message =
            erreur.error?.erreur || "Vous n'avez pas accès à cette ressource";
          break;

        case 404:
          messageErreur.titre = 'Non trouvé';
          messageErreur.message = erreur.error?.erreur || 'Ressource introuvable';
          break;

        case 409:
          messageErreur.titre = 'Conflit';
          messageErreur.message =
            erreur.error?.erreur || 'Cette ressource existe déjà';
          break;

        case 500:
          messageErreur.titre = 'Erreur serveur';
          messageErreur.message =
            'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
          break;

        default:
          messageErreur.message =
            erreur.error?.erreur || `Erreur ${erreur.status}: ${erreur.statusText}`;
      }
    }

    console.error('Erreur HTTP:', erreur);
    return messageErreur;
  }

  // Extraire les détails de validation Zod
  private extraireDetailsValidation(erreur: HttpErrorResponse): string | undefined {
    if (erreur.error?.details && Array.isArray(erreur.error.details)) {
      return erreur.error.details.map((d: any) => d.message).join(', ');
    }
    return undefined;
  }
}