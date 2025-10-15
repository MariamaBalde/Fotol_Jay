import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-user-sidebar',
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [CommonModule]
})
export class UserSidebarComponent {
  isCollapsed = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  isActiveRoute(route: string): boolean {
    return this.router.url === route;
  }

  navigateTo(route: string) {
    this.router.navigate([route]);
  }

  isVIP(): boolean {
    return this.authService.estVIP();
  }

  logout() {
    this.authService.deconnecter();
  }
}
