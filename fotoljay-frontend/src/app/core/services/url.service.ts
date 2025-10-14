import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  getImageUrl(cheminRelatif: string): string {
    if (!cheminRelatif) return '';
    
    // Extraire le nom du fichier
    const nomFichier = cheminRelatif.split('/').pop() || '';
    
    // Construire l'URL complète
    return `${environment.apiUrl.replace('/api', '')}/uploads/produits/${nomFichier}`;
  }
}