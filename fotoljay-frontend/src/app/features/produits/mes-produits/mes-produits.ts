import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProduitsService } from '../../../core/services/produits.service';
import { Produit, ReponseProduits } from '../../../core/models/produit.model';
import { Observable, Subscription } from 'rxjs';
import { NavbarComponent } from '../../shared/navbar/navbar.component';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-mes-produits',
  standalone: true,
  imports: [CommonModule, NavbarComponent],
  templateUrl: './mes-produits.html',
  styleUrls: ['./mes-produits.css']
})
export class MesProduitsComponent implements OnInit, OnDestroy {
  produits$: Observable<ReponseProduits> | null = null;
  chargement = true;
  erreur = '';

  // Statistiques
  totalProduits = 0;
  produitsActifs = 0;
  produitsEnAttente = 0;
  produitsExpires = 0;

  private routeSubscription?: Subscription;

  constructor(
    private produitsService: ProduitsService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationsService: NotificationsService
  ) {}

  ngOnInit(): void {
    this.chargerMesProduits();

    // S'abonner aux changements de route pour rafraîchir automatiquement
    this.routeSubscription = this.route.url.subscribe(() => {
      console.log('Navigation détectée, rechargement des produits...');
      this.chargerMesProduits();
    });
  }

  ngOnDestroy(): void {
    // Nettoyer la subscription pour éviter les fuites mémoire
    if (this.routeSubscription) {
      this.routeSubscription.unsubscribe();
    }
  }

  private chargerMesProduits(): void {
    this.chargement = true;
    this.erreur = '';

    this.produits$ = this.produitsService.obtenirMesProduits();

    this.produits$.subscribe({
      next: (reponse) => {
        this.chargement = false;
        this.calculerStatistiques(reponse.produits);
      },
      error: (erreur) => {
        this.chargement = false;
        this.erreur = 'Erreur lors du chargement de vos produits';
        console.error('Erreur chargement produits:', erreur);
      }
    });
  }

  private calculerStatistiques(produits: Produit[]): void {
    this.totalProduits = produits.length;
    this.produitsActifs = produits.filter(p => p.statut === 'APPROUVE').length;
    this.produitsEnAttente = produits.filter(p => p.statut === 'EN_ATTENTE').length;
    this.produitsExpires = produits.filter(p => p.statut === 'EXPIRE').length;
  }

  rafraichir(): void {
    this.chargerMesProduits();
  }

  naviguerVersCreation(): void {
    this.router.navigate(['/produits/creer']);
  }

  obtenirStatutLibelle(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'En attente de modération';
      case 'APPROUVE': return 'Approuvé';
      case 'REFUSE': return 'Refusé';
      case 'EXPIRE': return 'Expiré';
      default: return statut;
    }
  }

  obtenirCouleurStatut(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'warning';
      case 'APPROUVE': return 'success';
      case 'REFUSE': return 'danger';
      case 'EXPIRE': return 'secondary';
      default: return 'primary';
    }
  }

  peutRepublier(produit: Produit): boolean {
    return produit.statut === 'EXPIRE';
  }

  republierProduit(produit: Produit): void {
    if (confirm('Voulez-vous republier ce produit ? Il sera remis en modération.')) {
      // TODO: Implémenter la republication
      this.notificationsService.info('Fonctionnalité à venir', 'La republication sera bientôt disponible');
    }
  }

  modifierProduit(produit: Produit): void {
    // TODO: Implémenter la modification
    this.notificationsService.info('Fonctionnalité à venir', 'La modification de produits sera bientôt disponible');
  }

  supprimerProduit(produit: Produit): void {
    if (confirm(`Êtes-vous sûr de vouloir supprimer "${produit.titre}" ? Cette action est irréversible.`)) {
      // TODO: Implémenter la suppression
      this.notificationsService.info('Fonctionnalité à venir', 'La suppression de produits sera bientôt disponible');
    }
  }

  obtenirUrlImage(cheminRelatif: string): string {
    if (!cheminRelatif) return '';

    // Si l'URL commence par http, c'est déjà une URL complète
    if (cheminRelatif.startsWith('http')) {
      return cheminRelatif;
    }

    // Sinon, construire l'URL complète
    const baseUrl = 'http://localhost:3000'; // Ajuster selon votre configuration
    return `${baseUrl}${cheminRelatif}`;
  }

  filtrerParStatut(event: any): void {
    // Pour l'instant, on ne fait que recharger (le filtrage côté serveur n'est pas implémenté)
    this.chargerMesProduits();
  }

  obtenirIconeStatut(statut: string): string {
    switch (statut) {
      case 'EN_ATTENTE': return 'fas fa-clock';
      case 'APPROUVE': return 'fas fa-check-circle';
      case 'REFUSE': return 'fas fa-times-circle';
      case 'EXPIRE': return 'fas fa-hourglass-end';
      default: return 'fas fa-question-circle';
    }
  }

  calculerJoursRestants(produit: Produit): number {
    if (produit.statut !== 'APPROUVE' || !produit.dateExpiration) return 0;
    const maintenant = new Date();
    const expiration = new Date(produit.dateExpiration);
    const diff = expiration.getTime() - maintenant.getTime();
    return Math.ceil(diff / (1000 * 3600 * 24));
  }

  calculerProgressionExpiration(produit: Produit): number {
    if (produit.statut !== 'APPROUVE' || !produit.dateExpiration) return 0;
    const maintenant = new Date();
    const expiration = new Date(produit.dateExpiration);
    const creation = new Date(produit.dateCreation);
    const total = expiration.getTime() - creation.getTime();
    const ecoule = maintenant.getTime() - creation.getTime();
    return Math.max(0, Math.min(100, (ecoule / total) * 100));
  }

  handleImageError(event: any): void {
    console.error('Erreur de chargement image:', event);
    // Optionnel : remplacer par une image par défaut
    // event.target.src = '/assets/images/placeholder.png';
  }
}
