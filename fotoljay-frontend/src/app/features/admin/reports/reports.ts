import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent]
})
export class ReportsComponent implements OnInit {
  reports: any[] = [];
  loading = true;
  error: string | null = null;
  processingReportId: string | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getReports().subscribe({
      next: (data) => {
        this.reports = data.reports || [];
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement signalements:', error);
        alert('Erreur lors du chargement des signalements');
        this.loading = false;
      }
    });
  }

  processReport(reportId: string, action: string): void {
    this.processingReportId = reportId;
    this.adminService.processReport(reportId, action).subscribe({
      next: () => {
        this.loadReports(); // Recharger la liste
        this.processingReportId = null;
      },
      error: (error) => {
        console.error('Erreur traitement signalement:', error);
        this.processingReportId = null;
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'TRAITE': return 'status-approved';
      case 'REJETE': return 'status-rejected';
      case 'EN_ATTENTE': return 'status-pending';
      default: return 'status-pending';
    }
  }

  exportReport(type: string): void {
    this.adminService.exportReport(type).subscribe({
      next: (data) => {
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${type}-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (error) => {
        console.error('Erreur export:', error);
      }
    });
  }
}
