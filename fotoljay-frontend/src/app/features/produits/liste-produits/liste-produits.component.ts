import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProduitsService } from '../../../core/services/produits.service';
import { AuthService } from '../../../core/services/auth.service';
import { Produit, FiltresProduits } from '../../../core/models/produit.model';
import { Router } from '@angular/router';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';
import { ProductCardComponent } from '../../../shared/components/product-card/product-card.component';

@Component({
  selector: 'app-liste-produits',
  templateUrl: './liste-produits.component.html',
  styleUrls: ['./liste-produits.component.css'], // Changed from .scss to .css
  imports: [
    CommonModule,
    FormsModule,
    LoadingSpinnerComponent,
    ProductCardComponent
  ],
  standalone: true,
})
export class ListeProduitsComponent implements OnInit {
  produits: Produit[] = [];
  chargement = false;
  erreur = '';

  // Filtres
  filtres: FiltresProduits = {
    page: 1,
    limite: 12,
  };

  // Pagination
  pageActuelle = 1;
  totalPages = 1;
  totalProduits = 0;

  // Catégories disponibles
  categories = [
    'Tous',
    'Électronique',
    'Meubles',
    'Vêtements',
    'Sport',
    'Automobiles',
    'Immobilier',
    'Livres',
    'Jouets',
    'Autres',
  ];

  // États disponibles
  etats = ['Tous', 'NEUF', 'COMME_NEUF', 'BON_ETAT', 'USAGE'];

  // Recherche
  rechercheTexte = '';

  constructor(
    private produitsService: ProduitsService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.chargerProduits();
  }

  chargerProduits(): void {
    this.chargement = true;
    this.erreur = '';

    this.produitsService.listerProduits(this.filtres).subscribe({
      next: (reponse) => {
        this.produits = reponse.produits;
        this.pageActuelle = reponse.pagination.page;
        this.totalPages = reponse.pagination.totalPages;
        this.totalProduits = reponse.pagination.total;
        this.chargement = false;
      },
      error: (erreur) => {
        console.error('Erreur chargement produits:', erreur);
        this.erreur = 'Impossible de charger les produits';
        this.chargement = false;
      },
    });
  }

  filtrerParCategorie(categorie: string): void {
    if (categorie === 'Tous') {
      delete this.filtres.categorie;
    } else {
      this.filtres.categorie = categorie;
    }
    this.filtres.page = 1;
    this.chargerProduits();
  }

  filtrerParEtat(etat: string): void {
    if (etat === 'Tous') {
      delete this.filtres.etat;
    } else {
      this.filtres.etat = etat;
    }
    this.filtres.page = 1;
    this.chargerProduits();
  }

  rechercher(): void {
    if (this.rechercheTexte.trim()) {
      this.filtres.recherche = this.rechercheTexte.trim();
    } else {
      delete this.filtres.recherche;
    }
    this.filtres.page = 1;
    this.chargerProduits();
  }

  changerPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.filtres.page = page;
    this.chargerProduits();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  allerCreerProduit(): void {
    if (this.authService.estConnecte()) {
      this.router.navigate(['/produits/creer']);
    } else {
      this.router.navigate(['/auth/login']);
    }
  }

  obtenirTableauPages(): number[] {
    const pages: number[] = [];
    const debut = Math.max(1, this.pageActuelle - 2);
    const fin = Math.min(this.totalPages, this.pageActuelle + 2);

    for (let i = debut; i <= fin; i++) {
      pages.push(i);
    }

    return pages;
  }
}