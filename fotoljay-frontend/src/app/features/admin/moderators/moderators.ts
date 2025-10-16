import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { SidebarComponent } from '../sidebar/sidebar';
import { NotificationsService } from '../../../core/services/notifications.service';

@Component({
  selector: 'app-moderators',
  templateUrl: './moderators.html',
  styleUrls: ['./moderators.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, SidebarComponent]
})
export class ModeratorsComponent implements OnInit {
  moderators: any[] = [];
  ranking: any[] = [];
  loading = true;
  error: string | null = null;
  showCreateForm = false;
  selectedModeratorHistory: any[] | null = null;
  showEditForm = false;
  editingModerator: any = null;
  editForm = {
    nom: '',
    prenom: '',
    email: '',
    telephone: ''
  };

  newModerator = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    motDePasse: ''
  };

  constructor(private adminService: AdminService, private notificationsService: NotificationsService) {}

  ngOnInit(): void {
    this.loadModerators();
    this.loadRanking();
  }

  loadModerators(): void {
    this.loading = true;
    this.error = null;
    this.adminService.getModerators().subscribe({
      next: (data) => {
        this.moderators = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erreur chargement modérateurs:', error);
        this.notificationsService.error('Erreur de chargement', 'Impossible de charger les modérateurs');
        this.loading = false;
      }
    });
  }

  loadRanking(): void {
    this.adminService.getModeratorRanking().subscribe({
      next: (data) => {
        this.ranking = data;
      },
      error: (error) => {
        console.error('Erreur chargement classement:', error);
      }
    });
  }

  createModerator(): void {
    this.adminService.createModerator(this.newModerator).subscribe({
      next: () => {
        this.showCreateForm = false;
        this.newModerator = { nom: '', prenom: '', email: '', telephone: '', motDePasse: '' };
        this.loadModerators();
        this.loadRanking();
      },
      error: (error) => {
        console.error('Erreur création modérateur:', error);
        this.notificationsService.error('Erreur de création', 'Impossible de créer le modérateur');
      }
    });
  }

  updateUserRole(userId: string, newRole: string): void {
    this.adminService.updateUserRole(userId, newRole).subscribe({
      next: () => {
        this.loadModerators();
        this.loadRanking();
      },
      error: (error) => {
        console.error('Erreur mise à jour rôle:', error);
        this.notificationsService.error('Erreur de mise à jour', 'Impossible de mettre à jour le rôle');
      }
    });
  }

  updateModeratorStatus(userId: string, statut: string): void {
    this.adminService.updateModeratorStatus(userId, statut).subscribe({
      next: () => {
        this.loadModerators();
      },
      error: (error) => {
        console.error('Erreur mise à jour statut:', error);
        this.notificationsService.error('Erreur de mise à jour', 'Impossible de mettre à jour le statut');
      }
    });
  }

  viewModeratorHistory(moderatorId: string): void {
    this.adminService.getModeratorHistory(moderatorId).subscribe({
      next: (data) => {
        this.selectedModeratorHistory = data.decisions || [];
      },
      error: (error) => {
        console.error('Erreur chargement historique:', error);
        this.notificationsService.error('Erreur de chargement', 'Impossible de charger l\'historique');
      }
    });
  }

  closeHistoryModal(): void {
    this.selectedModeratorHistory = null;
  }

  editModerator(moderator: any): void {
    this.editingModerator = moderator;
    this.editForm = {
      nom: moderator.nom,
      prenom: moderator.prenom,
      email: moderator.email,
      telephone: moderator.telephone
    };
    this.showEditForm = true;
  }

  updateModerator(): void {
    if (!this.editingModerator) return;

    this.adminService.updateModerator(this.editingModerator.id, this.editForm).subscribe({
      next: () => {
        this.showEditForm = false;
        this.editingModerator = null;
        this.editForm = { nom: '', prenom: '', email: '', telephone: '' };
        this.loadModerators();
        this.loadRanking();
      },
      error: (error) => {
        console.error('Erreur mise à jour modérateur:', error);
        this.notificationsService.error('Erreur de mise à jour', 'Impossible de mettre à jour le modérateur');
      }
    });
  }

  cancelEdit(): void {
    this.showEditForm = false;
    this.editingModerator = null;
    this.editForm = { nom: '', prenom: '', email: '', telephone: '' };
  }

  deleteModerator(moderator: any): void {
    const confirmation = confirm(`Êtes-vous sûr de vouloir supprimer le modérateur ${moderator.prenom} ${moderator.nom} ?\n\nCette action va rétrograder l'utilisateur au rôle UTILISATEUR tout en préservant son historique de modération.`);

    if (confirmation) {
      this.adminService.deleteModerator(moderator.id).subscribe({
        next: (result) => {
          this.notificationsService.success('Modérateur supprimé', `Modérateur ${moderator.prenom} ${moderator.nom} supprimé avec succès`);
          this.loadModerators();
          this.loadRanking();
        },
        error: (error) => {
          console.error('Erreur suppression modérateur:', error);
          this.notificationsService.error('Erreur de suppression', 'Impossible de supprimer le modérateur');
        }
      });
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'ACTIF': return 'status-active';
      case 'INACTIF': return 'status-suspended';
      case 'SUSPENDU': return 'status-blocked';
      default: return 'status-active';
    }
  }

  getRoleClass(role: string): string {
    switch (role) {
      case 'ADMINISTRATEUR': return 'status-vip';
      case 'MODERATEUR': return 'status-approved';
      default: return 'status-pending';
    }
  }
}
