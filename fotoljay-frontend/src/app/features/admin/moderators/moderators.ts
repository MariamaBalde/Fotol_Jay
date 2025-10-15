import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../services/admin.service';
import { AdminHeaderComponent } from '../admin-header/admin-header.component';

@Component({
  selector: 'app-moderators',
  templateUrl: './moderators.html',
  styleUrls: ['./moderators.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, AdminHeaderComponent]
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

  constructor(private adminService: AdminService) {}

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
        alert('Erreur lors du chargement des modérateurs');
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
        alert('Erreur lors de la création du modérateur');
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
        alert('Erreur lors de la mise à jour du rôle');
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
        alert('Erreur lors de la mise à jour du statut');
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
        alert('Erreur lors du chargement de l\'historique');
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
        alert('Erreur lors de la mise à jour du modérateur');
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
          alert(`Modérateur ${moderator.prenom} ${moderator.nom} supprimé avec succès !\n\n${result.message}`);
          this.loadModerators();
          this.loadRanking();
        },
        error: (error) => {
          console.error('Erreur suppression modérateur:', error);
          alert('Erreur lors de la suppression du modérateur');
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
