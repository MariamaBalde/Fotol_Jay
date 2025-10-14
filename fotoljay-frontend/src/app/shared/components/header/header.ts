import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Utilisateur } from '../../../core/models/utilisateur.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
  imports: [CommonModule, FormsModule],
})
export class HeaderComponent implements OnInit {
  utilisateur$: Observable<Utilisateur | null>;
  menuOuvert = false;
  rechercheOuverte = false;
  termesRecherche = '';

  constructor(public authService: AuthService, private router: Router) {
    this.utilisateur$ = this.authService.utilisateur$;
  }

  ngOnInit(): void {}

  toggleMenu(): void {
    this.menuOuvert = !this.menuOuvert;
  }

  toggleRecherche(): void {
    this.rechercheOuverte = !this.rechercheOuverte;
  }

  rechercher(): void {
    if (this.termesRecherche.trim()) {
      this.router.navigate(['/produits'], {
        queryParams: { recherche: this.termesRecherche },
      });
      this.rechercheOuverte = false;
      this.termesRecherche = '';
    }
  }

  deconnecter(): void {
    this.authService.deconnecter();
    this.menuOuvert = false;
  }

  naviguerVers(route: string): void {
    this.router.navigate([route]);
    this.menuOuvert = false;
  }
}
