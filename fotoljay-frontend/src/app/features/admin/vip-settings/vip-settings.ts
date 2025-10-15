import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-vip-settings',
  templateUrl: './vip-settings.html',
  styleUrls: ['./vip-settings.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent]
})
export class VipSettingsComponent implements OnInit {
  // Onglets
  activeTab = 'settings';
  tabs = [
    { id: 'settings', label: 'Paramètres' },
    { id: 'pricing', label: 'Tarification' },
    { id: 'promo', label: 'Codes Promo' },
    { id: 'subscriptions', label: 'Abonnements' },
    { id: 'analytics', label: 'Analytics' }
  ];

  // Paramètres
  settings: any[] = [];
  loading = true;

  // Tarification
  pricingList: any[] = [];
  showPricingForm = false;
  newPricing = {
    duree: 7,
    prix: 0,
    reductionPourcent: 0
  };

  // Codes promo
  promoCodes: any[] = [];
  showPromoForm = false;
  newPromoCode = {
    code: '',
    description: '',
    reductionPourcent: 0,
    reductionMontant: 0,
    dureeBonus: 0,
    utilisationsMax: 0,
    dateExpiration: ''
  };

  // Abonnements
  subscriptions: any[] = [];
  showSubscriptionForm = false;
  newSubscription = {
    utilisateurId: '',
    duree: 7,
    codePromo: ''
  };

  // Analytics
  analytics: any = null;
  analyticsLoading = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadSettings();
    this.loadPricing();
    this.loadPromoCodes();
    this.loadSubscriptions();
    this.loadAnalytics();
  }

  setActiveTab(tabId: string): void {
    this.activeTab = tabId;
  }

  // Paramètres
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

  // Tarification
  loadPricing(): void {
    this.adminService.getVipPricing().subscribe({
      next: (data) => {
        this.pricingList = data;
      },
      error: (error) => {
        console.error('Erreur chargement tarification:', error);
      }
    });
  }

  createPricing(): void {
    this.adminService.createVipPricing(this.newPricing).subscribe({
      next: () => {
        this.loadPricing();
        this.showPricingForm = false;
        this.newPricing = { duree: 7, prix: 0, reductionPourcent: 0 };
      },
      error: (error) => {
        console.error('Erreur création tarification:', error);
      }
    });
  }

  updatePricingStatus(id: string, estActif: boolean): void {
    this.adminService.updateVipPricing(id, { estActif }).subscribe({
      next: () => {
        this.loadPricing();
      },
      error: (error) => {
        console.error('Erreur mise à jour statut tarification:', error);
      }
    });
  }

  // Codes promo
  loadPromoCodes(): void {
    this.adminService.getVipPromoCodes().subscribe({
      next: (data) => {
        this.promoCodes = data;
      },
      error: (error) => {
        console.error('Erreur chargement codes promo:', error);
      }
    });
  }

  createPromoCode(): void {
    const data = {
      ...this.newPromoCode,
      dateExpiration: this.newPromoCode.dateExpiration ? new Date(this.newPromoCode.dateExpiration).toISOString() : null
    };

    this.adminService.createVipPromoCode(data).subscribe({
      next: () => {
        this.loadPromoCodes();
        this.showPromoForm = false;
        this.newPromoCode = {
          code: '',
          description: '',
          reductionPourcent: 0,
          reductionMontant: 0,
          dureeBonus: 0,
          utilisationsMax: 0,
          dateExpiration: ''
        };
      },
      error: (error) => {
        console.error('Erreur création code promo:', error);
      }
    });
  }

  updatePromoStatus(id: string, estActif: boolean): void {
    this.adminService.updateVipPromoCode(id, { estActif }).subscribe({
      next: () => {
        this.loadPromoCodes();
      },
      error: (error) => {
        console.error('Erreur mise à jour statut code promo:', error);
      }
    });
  }

  // Abonnements
  loadSubscriptions(): void {
    this.adminService.getVipSubscriptions('ACTIF').subscribe({
      next: (data) => {
        this.subscriptions = data.subscriptions;
      },
      error: (error) => {
        console.error('Erreur chargement abonnements:', error);
      }
    });
  }

  createSubscription(): void {
    this.adminService.createVipSubscription(this.newSubscription).subscribe({
      next: () => {
        this.loadSubscriptions();
        this.showSubscriptionForm = false;
        this.newSubscription = { utilisateurId: '', duree: 7, codePromo: '' };
      },
      error: (error) => {
        console.error('Erreur création abonnement:', error);
      }
    });
  }

  extendSubscription(subscriptionId: string): void {
    const duree = prompt('Durée supplémentaire (jours):');
    if (duree && parseInt(duree) > 0) {
      this.adminService.extendVipSubscription(subscriptionId, parseInt(duree)).subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (error) => {
          console.error('Erreur extension abonnement:', error);
        }
      });
    }
  }

  refundSubscription(subscriptionId: string): void {
    if (confirm('Êtes-vous sûr de vouloir rembourser cet abonnement ?')) {
      this.adminService.refundVipSubscription(subscriptionId, 'Remboursement demandé').subscribe({
        next: () => {
          this.loadSubscriptions();
        },
        error: (error) => {
          console.error('Erreur remboursement abonnement:', error);
        }
      });
    }
  }

  // Analytics
  loadAnalytics(): void {
    this.analyticsLoading = true;
    this.adminService.getVipAnalytics().subscribe({
      next: (data) => {
        this.analytics = data;
        this.analyticsLoading = false;
      },
      error: (error) => {
        console.error('Erreur chargement analytics:', error);
        this.analyticsLoading = false;
      }
    });
  }
}
