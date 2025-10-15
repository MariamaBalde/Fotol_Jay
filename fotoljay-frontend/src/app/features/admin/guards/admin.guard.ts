import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    const user = this.authService.obtenirUtilisateurActuel();

    if (!user) {
      this.router.navigate(['/auth/connexion']);
      return false;
    }

    if (!['ADMINISTRATEUR', 'MODERATEUR'].includes(user.role)) {
      this.router.navigate(['/']);
      return false;
    }

    return true;
  }
}