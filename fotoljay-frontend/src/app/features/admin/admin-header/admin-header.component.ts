import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-header',
  templateUrl: './admin-header.component.html',
  styleUrls: ['./admin-header.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class AdminHeaderComponent {
  showLogoutModal = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  confirmLogout(): void {
    this.authService.deconnecter();
    this.router.navigate(['/auth/login']);
    this.showLogoutModal = false;
  }
}