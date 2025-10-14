import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitsService } from '../../../core/services/produits.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { Produit } from '../../../core/models/produit.model';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { UrlService } from '../../../core/services/url.service';

@Component({
  selector: 'app-detail-produit',
  templateUrl: './detail-produit.component.html',
  styleUrls: ['./detail-produit.component.css'],
  standalone: true,
  imports: [CommonModule, LoadingSpinnerComponent],
})
export class DetailProduitComponent implements OnInit {
  produit: Produit | null = null;
  chargement = true;
  erreur = '';
  imageActive = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitsService: ProduitsService,
    public authService: AuthService,
    private notificationService: NotificationsService,
    private urlService: UrlService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.chargerProduit(id);
    }
  }

  chargerProduit(id: string): void {
    this.chargement = true;
    this.produitsService.obtenirProduit(id).subscribe({
      next: (produit) => {
        this.produit = produit;
        this.chargement = false;
      },
      error: (erreur) => {
        console.error('Erreur chargement produit:', erreur);
        this.erreur = 'Produit introuvable';
        this.chargement = false;
      },
    });
  }

  obtenirUrlImage(cheminRelatif: string): string {
    return this.urlService.getImageUrl(cheminRelatif);
  }

  changerImage(index: number): void {
    this.imageActive = index;
  }

  contacterVendeur(): void {
    if (!this.authService.estConnecte()) {
      this.notificationService.warning(
        'Connexion requise',
        'Veuillez vous connecter pour contacter le vendeur'
      );
      this.router.navigate(['/auth/login']);
      return;
    }

    if (!this.produit) return;

    // Enregistrer le contact
    this.produitsService.enregistrerContact(this.produit.id).subscribe({
      next: () => {
        this.notificationService.success(
          'Contact enregistré',
          'Le vendeur sera notifié de votre intérêt'
        );
      },
      error: (erreur) => {
        console.error('Erreur enregistrement contact:', erreur);
      },
    });
  }

  appelerVendeur(): void {
    if (!this.produit) return;
    this.contacterVendeur();
    window.location.href = `tel:${this.produit.utilisateur.telephone}`;
  }

  envoyerWhatsApp(): void {
    if (!this.produit) return;
    this.contacterVendeur();
    const telephone = this.produit.utilisateur.telephone.replace(/\s/g, '');
    const message = encodeURIComponent(
      `Bonjour, je suis intéressé par votre produit "${this.produit.titre}" sur FreshMarket`
    );
    window.open(`https://wa.me/${telephone}?text=${message}`, '_blank');
  }

  calculerJoursRestants(): number {
    if (!this.produit) return 0;
    const maintenant = new Date();
    const expiration = new Date(this.produit.dateExpiration);
    const diff = expiration.getTime() - maintenant.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  estProprietaire(): boolean {
    if (!this.produit || !this.authService.estConnecte()) return false;
    const utilisateur = this.authService.obtenirUtilisateurActuel();
    return utilisateur?.id === this.produit.utilisateurId;
  }

  retour(): void {
    this.router.navigate(['/produits']);
  }

  hasImages(): boolean {
    return !!this.produit?.images && this.produit.images.length > 0;
  }

  hasMultipleImages(): boolean {
    return !!this.produit?.images && this.produit.images.length > 1;
  }

  getImagesCount(): number {
    return this.produit?.images?.length || 0;
  }

  getActiveImageUrl(): string {
    if (!this.produit?.images?.[this.imageActive]?.url) {
      return '';
    }
    return this.obtenirUrlImage(this.produit.images[this.imageActive].url);
  }
}