import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { ErrorHandlerService } from '../../../core/services/error-handler';
import { ReponseAuth } from '../../../core/models/utilisateur.model';


@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './connexion.component.html',
  styleUrls: ['./connexion.component.css']
})
export class ConnexionComponent implements OnInit {
  loginForm!: FormGroup;
  erreurMessage = '';
  enChargement = false;
  afficherMotDePasse = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationsService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    // Rediriger si déjà connecté
    if (this.authService.estConnecte()) {
      this.router.navigate(['/produits']);
      return;
    }

    // Initialiser le formulaire
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      motDePasse: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.enChargement = true;
    this.erreurMessage = '';

    this.authService.connecter(this.loginForm.value).subscribe({
      next: (reponse: ReponseAuth) => {
        if (reponse && reponse.utilisateur) {
          this.notificationService.success(
            'Connexion réussie',
            `Bienvenue ${reponse.utilisateur.prenom || 'utilisateur'} !`
          );

          // Redirection basée sur le rôle
          if (reponse.utilisateur.role === 'ADMINISTRATEUR') {
            this.router.navigate(['/admin']);
          } else {
            this.router.navigate(['/produits']);
          }
        } else {
          this.notificationService.error(
            'Erreur de connexion',
            'La réponse du serveur est invalide'
          );
        }
      },
      error: (erreur) => {
        const messageErreur = this.errorHandler.gererErreurHttp(erreur);
        this.erreurMessage = messageErreur.message;
        this.notificationService.error(messageErreur.titre, messageErreur.message);
        this.enChargement = false;
      },
      complete: () => {
        this.enChargement = false;
      }
    });
  }

  // Getters pour accéder facilement aux contrôles
  get email() {
    return this.loginForm.get('email');
  }

  get motDePasse() {
    return this.loginForm.get('motDePasse');
  }

  // Basculer l'affichage du mot de passe
  toggleMotDePasse(): void {
    this.afficherMotDePasse = !this.afficherMotDePasse;
  }
}
