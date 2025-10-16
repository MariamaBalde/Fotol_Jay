import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { AdminService, PendingProductDto, ModerationDecisionDto } from '../services/admin.service';
import { SidebarComponent } from '../sidebar/sidebar';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class ModerationComponent implements OnInit, OnDestroy {
  pendingProducts: PendingProductDto[] = [];
  filteredProducts: PendingProductDto[] = [];
  loading = true;
  error: string | null = null;
  moderatingProductId: string | null = null;
  selectedImage: string | null = null;
  selectedProduct: PendingProductDto | null = null;

  // Filtres
  selectedCategory = '';
  sortOrder = 'date-desc';
  categories: string[] = [];
  avgModerationTime = 0;
  rejectionRate = 0;

  // Statistiques
  moderationStats: any = null;

  // Modals
  showRejectModal = false;
  showDetailedModal = false;
  productToReject: PendingProductDto | null = null;
  rejectReason = '';
  detailedProduct: PendingProductDto | null = null;
  currentImageIndex = 0;

  private subscriptions: Subscription[] = [];

  constructor(private adminService: AdminService, private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  applyFilters(): void {
    this.filteredProducts = [...this.pendingProducts];

    // Filtre par catégorie
    if (this.selectedCategory) {
      this.filteredProducts = this.filteredProducts.filter(p => p.categorie === this.selectedCategory);
    }

    // Tri
    this.filteredProducts.sort((a, b) => {
      switch (this.sortOrder) {
        case 'date-asc':
          return new Date(a.dateCreation).getTime() - new Date(b.dateCreation).getTime();
        case 'date-desc':
          return new Date(b.dateCreation).getTime() - new Date(a.dateCreation).getTime();
        case 'price-asc':
          return a.prix - b.prix;
        case 'price-desc':
          return b.prix - a.prix;
        default:
          return 0;
      }
    });
  }

  openRejectModal(product: PendingProductDto): void {
    this.productToReject = product;
    this.rejectReason = '';
    this.showRejectModal = true;
  }

  confirmReject(): void {
    if (this.productToReject && this.rejectReason.trim()) {
      this.rejectProduct(this.productToReject.id, this.rejectReason);
      this.showRejectModal = false;
      this.productToReject = null;
    }
  }

  openDetailedModal(product: PendingProductDto, imageIndex: number): void {
    this.detailedProduct = product;
    this.currentImageIndex = imageIndex;
    this.showDetailedModal = true;
  }

  nextImage(): void {
    if (this.detailedProduct && this.detailedProduct.images) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.detailedProduct.images.length;
    }
  }

  prevImage(): void {
    if (this.detailedProduct && this.detailedProduct.images) {
      this.currentImageIndex = this.currentImageIndex === 0
        ? this.detailedProduct.images.length - 1
        : this.currentImageIndex - 1;
    }
  }

  closeDetailedModal(): void {
    this.showDetailedModal = false;
    this.detailedProduct = null;
    this.currentImageIndex = 0;
  }

  closeRejectModal(): void {
    this.showRejectModal = false;
    this.productToReject = null;
    this.rejectReason = '';
  }

  loadPendingProducts(): void {
    this.loading = true;
    this.error = null;

    const sub = this.adminService.getPendingProducts().subscribe({
      next: (products) => {
        this.pendingProducts = products;
        this.filteredProducts = [...products];

        // Extraire les catégories uniques
        this.categories = [...new Set(products.map(p => p.categorie))].sort();

        // Calculer les statistiques
        this.calculateStats();

        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement produits en attente:', error);
        this.notificationsService.error('Erreur de chargement', 'Impossible de charger les produits en attente');
        this.loading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  calculateStats(): void {
    // Statistiques basiques
    this.avgModerationTime = 250; // ms - simulé pour l'instant
    this.rejectionRate = Math.round(Math.random() * 20); // % - simulé

    // Statistiques détaillées simulées
    this.moderationStats = {
      avgTime: 245,
      topCategory: this.categories[0] || 'Électronique',
      topCategoryCount: Math.floor(Math.random() * 50) + 10,
      rejectionRate: Math.round(Math.random() * 25),
      weeklyModerated: Math.floor(Math.random() * 200) + 50,
      totalModerated: Math.floor(Math.random() * 1000) + 200,
      categoryBreakdown: this.categories.slice(0, 5).map(cat => ({
        name: cat,
        count: Math.floor(Math.random() * 100) + 10
      }))
    };
  }

  approveProduct(productId: string): void {
    this.moderateProduct(productId, 'APPROVED');
  }

  rejectProduct(productId: string, reason?: string): void {
    this.moderateProduct(productId, 'REJECTED', reason);
  }

  private moderateProduct(productId: string, decision: 'APPROVED' | 'REJECTED', reason?: string): void {
    this.moderatingProductId = productId;

    const decisionDto: ModerationDecisionDto = {
      decision: decision === 'APPROVED' ? 'APPROUVER' : 'REFUSER',
      commentaire: reason || undefined
    };

    const sub = this.adminService.moderateProduct(productId, decisionDto).subscribe({
      next: (result) => {
        console.log('Produit modéré:', result);
        // Recharger la liste
        this.loadPendingProducts();
        this.moderatingProductId = null;
      },
      error: (error) => {
        console.error('Erreur modération:', error);
        this.notificationsService.error('Erreur de modération', 'Impossible de modérer le produit');
        this.moderatingProductId = null;
      }
    });

    this.subscriptions.push(sub);
  }

  getImageUrl(imagePath: string): string {
    if (!imagePath) return '';
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:3000${imagePath}`;
  }

  openImageModal(imageUrl: string): void {
    this.selectedImage = imageUrl;
  }

  closeImageModal(): void {
    this.selectedImage = null;
  }
}