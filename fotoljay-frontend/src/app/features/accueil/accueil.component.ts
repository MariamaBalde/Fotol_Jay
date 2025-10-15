import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ProduitsService } from '../../core/services/produits.service';
import { Produit } from '../../core/models/produit.model';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-accueil',
  templateUrl: './accueil.component.html',
  styleUrls: ['./accueil.component.css'],
  imports: [CommonModule, NavbarComponent],
  standalone: true
})
export class AccueilComponent implements OnInit {
  produitsVedettes: Produit[] = [];
  stats = {
    totalProduits: 0,
    produitsApprouves: 0,
    utilisateursActifs: 0
  };
  chargement = false;

  constructor(
    private router: Router,
    public authService: AuthService,
    private produitsService: ProduitsService
  ) {}

  ngOnInit(): void {
    this.chargerProduitsVedettes();
    this.chargerStats();
  }

  chargerProduitsVedettes(): void {
    this.chargement = true;
    // Charger les produits approuvés les plus récents
    this.produitsService.listerProduits({
      page: 1,
      limite: 8
    }).subscribe({
      next: (reponse) => {
        // Filtrer côté client les produits approuvés (car le filtre statut n'est pas disponible)
        this.produitsVedettes = reponse.produits.filter(p => p.statut === 'APPROUVE');
        this.chargement = false;
      },
      error: (erreur) => {
        console.error('Erreur chargement produits vedettes:', erreur);
        this.chargement = false;
      }
    });
  }

  chargerStats(): void {
    // TODO: Implémenter endpoint pour récupérer les stats générales
    // Pour l'instant, valeurs simulées
    this.stats = {
      totalProduits: 156,
      produitsApprouves: 142,
      utilisateursActifs: 89
    };
  }

  allerProduits(): void {
    this.router.navigate(['/produits']);
  }

  allerConnexion(): void {
    this.router.navigate(['/auth/login']);
  }

  allerInscription(): void {
    this.router.navigate(['/auth/register']);
  }

  voirProduit(produit: Produit): void {
    this.router.navigate(['/produits', produit.id]);
  }
}