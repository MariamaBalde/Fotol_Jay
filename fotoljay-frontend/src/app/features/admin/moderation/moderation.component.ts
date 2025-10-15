import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AdminService, PendingProductDto, ModerationDecisionDto } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-moderation',
  templateUrl: './moderation.component.html',
  styleUrls: ['./moderation.component.css'],
  standalone: true,
  imports: [CommonModule, AdminHeaderComponent]
})
export class ModerationComponent implements OnInit, OnDestroy {
  pendingProducts: PendingProductDto[] = [];
  loading = true;
  error: string | null = null;
  moderatingProductId: string | null = null;
  selectedImage: string | null = null;

  private subscriptions: Subscription[] = [];

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadPendingProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  loadPendingProducts(): void {
    this.loading = true;
    this.error = null;

    const sub = this.adminService.getPendingProducts().subscribe({
      next: (products) => {
        this.pendingProducts = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement produits en attente:', error);
        alert('Erreur lors du chargement des produits en attente');
        this.loading = false;
      }
    });

    this.subscriptions.push(sub);
  }

  approveProduct(productId: string): void {
    this.moderateProduct(productId, 'APPROVED');
  }

  rejectProduct(productId: string): void {
    this.moderateProduct(productId, 'REJECTED');
  }

  private moderateProduct(productId: string, decision: 'APPROVED' | 'REJECTED'): void {
    this.moderatingProductId = productId;

    const decisionDto: ModerationDecisionDto = {
      decision: decision === 'APPROVED' ? 'APPROUVER' : 'REFUSER'
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
        alert('Erreur lors de la modération du produit');
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