import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
  imports: [CommonModule],
  standalone: true
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    public router: Router
  ) {}

  allerConnexion(): void {
    this.router.navigate(['/auth/login']);
  }

  allerInscription(): void {
    this.router.navigate(['/auth/register']);
  }

  seDeconnecter(): void {
    this.authService.deconnecter();
    this.router.navigate(['/']);
  }

  allerDashboard(): void {
    if (this.authService.estAdministrateur()) {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/produits/mes-produits']);
    }
  }
}