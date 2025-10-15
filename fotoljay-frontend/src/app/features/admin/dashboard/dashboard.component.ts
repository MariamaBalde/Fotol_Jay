import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AdminService, DashboardStats, DashboardAlert } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent]
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  alerts: DashboardAlert[] = [];
  loading = true;
  error: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private adminService: AdminService, private router: Router) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = null;

    const statsSub = this.adminService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.generateAlerts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement dashboard:', error);
        this.error = 'Erreur lors du chargement des statistiques';
        this.loading = false;
      }
    });

    this.subscriptions.push(statsSub);
  }

  private generateAlerts(): void {
    this.alerts = [];

    if (this.stats) {
      // Alerte produits en attente
      if (this.stats.pendingProducts > 10) {
        this.alerts.push({
          id: 'pending-products',
          type: 'warning',
          title: 'Produits en attente',
          message: `${this.stats.pendingProducts} produits attendent modération`,
          actionUrl: '/admin/moderation',
          createdAt: new Date()
        });
      }

      // Alerte taux de modération faible
      if (this.stats.moderationRate < 70) {
        this.alerts.push({
          id: 'low-moderation-rate',
          type: 'error',
          title: 'Taux de modération faible',
          message: `Seuls ${this.stats.moderationRate}% des produits sont approuvés`,
          createdAt: new Date()
        });
      }

      // Alerte nouveaux utilisateurs
      if (this.stats.newUsersToday && this.stats.newUsersToday > 0) {
        this.alerts.push({
          id: 'new-users',
          type: 'info',
          title: 'Nouveaux utilisateurs',
          message: `${this.stats.newUsersToday} nouveaux utilisateurs aujourd'hui`,
          createdAt: new Date()
        });
      }

      // Alerte signalements en attente
      if (this.stats.pendingReports && this.stats.pendingReports > 0) {
        this.alerts.push({
          id: 'pending-reports',
          type: 'error',
          title: 'Signalements en attente',
          message: `${this.stats.pendingReports} signalements nécessitent une attention`,
          actionUrl: '/admin/reports',
          createdAt: new Date()
        });
      }

      // Alerte erreurs système
      if (this.stats.recentErrors && this.stats.recentErrors > 0) {
        this.alerts.push({
          id: 'system-errors',
          type: 'error',
          title: 'Erreurs système',
          message: `${this.stats.recentErrors} erreurs détectées dans les dernières 24h`,
          createdAt: new Date()
        });
      }

      // Alerte taux de conversion faible
      if (this.stats.conversionRate !== undefined && this.stats.conversionRate < 5) {
        this.alerts.push({
          id: 'low-conversion',
          type: 'warning',
          title: 'Taux de conversion faible',
          message: `Seulement ${this.stats.conversionRate}% des vues génèrent des contacts`,
          createdAt: new Date()
        });
      }

      // Alerte performance
      if (this.stats.avgResponseTime && this.stats.avgResponseTime > 2000) {
        this.alerts.push({
          id: 'performance-issue',
          type: 'warning',
          title: 'Performance dégradée',
          message: `Temps de réponse moyen: ${this.stats.avgResponseTime}ms`,
          createdAt: new Date()
        });
      }
    }
  }

  refresh(): void {
    this.loadDashboardData();
  }

  dismissAlert(alertId: string): void {
    this.alerts = this.alerts.filter(alert => alert.id !== alertId);
  }

  navigateTo(url: string): void {
    this.router.navigate([url]);
  }

  exportReports(): void {
    this.adminService.exportReport('users').subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-users-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur export:', error);
      }
    });
  }
}