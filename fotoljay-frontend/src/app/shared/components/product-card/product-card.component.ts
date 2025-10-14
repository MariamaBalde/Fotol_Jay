import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Produit } from '../../../core/models/produit.model';
import { environment } from '../../../../environments/environment';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class ProductCardComponent {
  @Input() produit!: Produit;

  readonly placeholderImage = '/assets/images/placeholder.png';
  private imageLoaded = false;

  constructor(private router: Router) {}

  obtenirUrlImage(cheminRelatif: string): string {
    return `${environment.apiUrl.replace('/api', '')}${cheminRelatif}`;
  }

  voirDetail(): void {
    this.router.navigate(['/produits', this.produit.id]);
  }

  estVIP(): boolean {
    if (!this.produit.utilisateur.finVip) return false;
    const maintenant = new Date();
    const finVip = new Date(this.produit.utilisateur.finVip);
    return finVip > maintenant;
  }

  calculerJoursRestants(): number {
    const maintenant = new Date();
    const expiration = new Date(this.produit.dateExpiration);
    const diff = expiration.getTime() - maintenant.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  obtenirCouleurExpiration(): string {
    const jours = this.calculerJoursRestants();
    if (jours <= 2) return 'danger';
    if (jours <= 4) return 'warning';
    return 'success';
  }

  handleImageError(event: any) {
    event.target.src = this.placeholderImage; // Utilisez une image par défaut
    console.warn('Erreur de chargement image:', event);
  }
}