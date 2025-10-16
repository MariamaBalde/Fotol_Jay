import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  getImageUrl(cheminRelatif: string): string {
    if (!cheminRelatif) return '';
    
    // Si c'est une URL complète (http/https), la retourner telle quelle
    if (cheminRelatif.startsWith('http')) {
      return cheminRelatif;
    }
    
    // Si c'est un chemin relatif, construire l'URL complète
    return `${environment.apiUrl.replace('/api', '')}${cheminRelatif}`;
  }
}