import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationsService } from '../../../core/services/notifications.service';
import { ErrorHandlerService } from '../../../core/services/error-handler';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, 
    ReactiveFormsModule,
    RouterModule  // Ajoutez cette ligne

  ],
  templateUrl: './inscription.component.html',
  styleUrls: ['./inscription.component.css']
})
export class InscriptionComponent implements OnInit {
  registerForm!: FormGroup;
  erreurMessage = '';
  enChargement = false;
  afficherMotDePasse = false;
  afficherConfirmation = false;

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
    }

    // Initialiser le formulaire
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        motDePasse: ['', [Validators.required, Validators.minLength(8)]],
        confirmationMotDePasse: ['', [Validators.required]],
        prenom: ['', [Validators.required, Validators.minLength(2)]],
        nom: ['', [Validators.required, Validators.minLength(2)]],
        telephone: [
          '',
          [Validators.required, Validators.pattern(/^(\+221)?[0-9]{9}$/)],
        ],
        localisation: [''],
        accepterCGU: [false, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  // Validateur personnalisé pour vérifier que les mots de passe correspondent
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const motDePasse = group.get('motDePasse');
    const confirmation = group.get('confirmationMotDePasse');

    if (!motDePasse || !confirmation) {
      return null;
    }

    return motDePasse.value === confirmation.value ? null : { passwordMismatch: true };
  }

  // Getters
  get email() {
    return this.registerForm.get('email');
  }

  get motDePasse() {
    return this.registerForm.get('motDePasse');
  }

  get confirmationMotDePasse() {
    return this.registerForm.get('confirmationMotDePasse');
  }

  get prenom() {
    return this.registerForm.get('prenom');
  }

  get nom() {
    return this.registerForm.get('nom');
  }

  get telephone() {
    return this.registerForm.get('telephone');
  }

  get localisation() {
    return this.registerForm.get('localisation');
  }

  get accepterCGU() {
    return this.registerForm.get('accepterCGU');
  }

  // Vérifier si les mots de passe correspondent
  get passwordsMatch(): boolean {
    return !this.registerForm.hasError('passwordMismatch');
  }

  // Basculer l'affichage des mots de passe
  toggleMotDePasse(): void {
    this.afficherMotDePasse = !this.afficherMotDePasse;
  }

  toggleConfirmation(): void {
    this.afficherConfirmation = !this.afficherConfirmation;
  }

  // Soumettre le formulaire
  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.enChargement = true;
    this.erreurMessage = '';

    // Préparer les données (exclure confirmationMotDePasse et accepterCGU)
    const { confirmationMotDePasse, accepterCGU, ...donnees } = this.registerForm.value;

    this.authService.inscrire(donnees).subscribe({
      next: (reponse) => {
this.notificationService.success(
          'Inscription réussie',
          `Bienvenue sur FotolJay, ${reponse.utilisateur.prenom} !`
        );        this.router.navigate(['/produits']);
      },
      error: (erreur) => {
        const messageErreur = this.errorHandler.gererErreurHttp(erreur);
        this.erreurMessage =messageErreur.message;
        this.notificationService.error(messageErreur.titre, messageErreur.message);
        this.enChargement = false;
      },
      complete: () => {
        this.enChargement = false;
      },
    });
  }
}
