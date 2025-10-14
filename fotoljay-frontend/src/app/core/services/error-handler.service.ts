import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  handleError(error: any): string {
    // Logique de gestion d'erreur
    return 'Une erreur est survenue';
  }

  gererErreurHttp(error: any) {
    return {
      titre: 'Erreur',
      message: error.message || 'Une erreur est survenue'
    };
  }
}