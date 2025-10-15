import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-vip-settings',
  templateUrl: './vip-settings.html',
  styleUrls: ['./vip-settings.css'],
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent]
})
export class VipSettingsComponent implements OnInit {
  settings: any[] = [];
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.loading = true;
    this.adminService.getVipSettings().subscribe({
      next: (data) => {
        this.settings = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement paramètres VIP:', error);
        this.loading = false;
      }
    });
  }

  updateSetting(key: string, newValue: string): void {
    this.adminService.updateVipSetting(key, newValue).subscribe({
      next: () => {
        this.loadSettings(); // Recharger la liste
      },
      error: (error) => {
        console.error('Erreur mise à jour paramètre:', error);
      }
    });
  }
}
