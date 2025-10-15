import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, UserDto, UsersResponse } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent]
})
export class UsersComponent implements OnInit {
  users: UserDto[] = [];
  loading = true;
  error: string | null = null;
  total = 0;
  page = 1;
  limit = 20;

  // Méthode pour Math.ceil dans le template
  get totalPages(): number {
    return Math.ceil(this.total / this.limit);
  }

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getUsers({ page: this.page, limit: this.limit }).subscribe({
      next: (response: UsersResponse) => {
        this.users = response.users;
        this.total = response.total;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement utilisateurs:', error);
        alert('Erreur lors du chargement des utilisateurs');
        this.loading = false;
      }
    });
  }

  updateUserStatus(userId: string, newStatus: string): void {
    this.adminService.updateUserStatus(userId, { status: newStatus }).subscribe({
      next: () => {
        this.loadUsers(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur mise à jour statut:', error);
      }
    });
  }

  onPageChange(newPage: number): void {
    this.page = newPage;
    this.loadUsers();
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF': return 'status-active';
      case 'SUSPENDU': return 'status-suspended';
      case 'BLOQUE': return 'status-blocked';
      default: return 'status-pending';
    }
  }
}
