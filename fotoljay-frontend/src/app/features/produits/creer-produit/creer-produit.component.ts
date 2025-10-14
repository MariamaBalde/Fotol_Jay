import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProduitsService } from '../../../core/services/produits.service';
import { UploadService } from '../../../core/services/upload.service';
import { NotificationService } from '../../../core/services/notification.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner';

interface ImageCapturee {
  base64: string;
  ordre: number;
}

@Component({
  selector: 'app-creer-produit',
  templateUrl: './creer-produit.component.html',
  styleUrls: ['./creer-produit.component.css'], // Changé de .scss à .css
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ]
})
export class CreerProduitComponent implements OnInit {
  produitForm!: FormGroup;
  images: ImageCapturee[] = [];
  enChargement = false;
  uploadEnCours = false;
  etapeActuelle: 'photos' | 'infos' = 'photos';

  categories = [
    'Électronique',
    'Meubles',
    'Vêtements',
    'Sport',
    'Automobiles',
    'Immobilier',
    'Livres',
    'Jouets',
    'Autres',
  ];

  etats = [
    { value: 'NEUF', label: 'Neuf' },
    { value: 'COMME_NEUF', label: 'Comme neuf' },
    { value: 'BON_ETAT', label: 'Bon état' },
    { value: 'USAGE', label: 'Usagé' },
  ];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private produitsService: ProduitsService,
    private uploadService: UploadService,
    private notificationService: NotificationService,
    private errorHandler: ErrorHandlerService
  ) {}

  ngOnInit(): void {
    this.initialiserFormulaire();
  }

  initialiserFormulaire(): void {
    this.produitForm = this.fb.group({
      titre: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],
      description: [
        '',
        [Validators.required, Validators.minLength(20), Validators.maxLength(1000)],
      ],
      prix: ['', [Validators.required, Validators.min(100)]],
      categorie: ['', Validators.required],
      etat: ['', Validators.required],
    });
  }

  // === GESTION DES PHOTOS ===

  async prendrePhoto(): Promise<void> {
    if (this.images.length >= 5) {
      this.notificationService.warning('Limite atteinte', 'Maximum 5 photos autorisées');
      return;
    }

    try {
      const photoBase64 = await this.uploadService.prendrePhoto();
      
      // Vérifier la taille de l'image
      const tailleMo = this.calculerTailleBase64(photoBase64);
      if (tailleMo > 5) { // Limite de 5Mo
        throw new Error('Image trop volumineuse (max 5Mo)');
      }

      this.images.push({
        base64: photoBase64,
        ordre: this.images.length + 1,
      });

      this.notificationService.success('Photo ajoutée', 'Photo capturée avec succès');
    } catch (erreur: any) {
      console.error('Erreur capture photo:', erreur);
      this.notificationService.error(
        'Erreur',
        erreur.message || 'Impossible de prendre la photo'
      );
    }
  }

  private calculerTailleBase64(base64: string): number {
    const taille = (base64.length * 3) / 4;
    return taille / (1024 * 1024); // Convertir en Mo
  }

  supprimerPhoto(index: number): void {
    this.images.splice(index, 1);
    // Réorganiser les ordres
    this.images.forEach((img, i) => {
      img.ordre = i + 1;
    });
  }

  deplacerPhoto(index: number, direction: 'up' | 'down'): void {
    if (direction === 'up' && index > 0) {
      [this.images[index], this.images[index - 1]] = [this.images[index - 1], this.images[index]];
    } else if (direction === 'down' && index < this.images.length - 1) {
      [this.images[index], this.images[index + 1]] = [this.images[index + 1], this.images[index]];
    }

    // Réorganiser les ordres
    this.images.forEach((img, i) => {
      img.ordre = i + 1;
    });
  }

  passerAuxInfos(): void {
    if (this.images.length === 0) {
      this.notificationService.warning('Photos requises', 'Ajoutez au moins 1 photo');
      return;
    }
    this.etapeActuelle = 'infos';
  }

  retourAuxPhotos(): void {
    this.etapeActuelle = 'photos';
  }

  // === SOUMISSION DU FORMULAIRE ===

  async onSubmit(): Promise<void> {
    if (this.produitForm.invalid) {
      this.produitForm.markAllAsTouched();
      this.notificationService.warning('Formulaire invalide', 'Veuillez remplir tous les champs');
      return;
    }

    if (this.images.length === 0) {
      this.notificationService.warning('Photos requises', 'Ajoutez au moins 1 photo');
      this.etapeActuelle = 'photos';
      return;
    }

    this.enChargement = true;

    try {
      // 1. Upload des images
      this.uploadEnCours = true;
      const imagesBase64 = this.images.map((img) => img.base64);
      const reponseUpload = await this.uploadService.uploadImages(imagesBase64).toPromise();

      if (!reponseUpload?.images?.length) {
        throw new Error('Erreur lors de l\'upload des images');
      }

      // 2. Préparer les données du produit
      const donneesImages = reponseUpload.images.map((img, index) => ({
        url: img.url,
        urlMiniature: img.urlMiniature || img.url,
        ordre: index + 1,
        metadata: {
          largeur: img.metadata?.largeur || 800,
          hauteur: img.metadata?.hauteur || 600,
          taille: img.metadata?.taille || 0
        }
      }));

      const donneesProduit = {
        ...this.produitForm.value,
        prix: Number(this.produitForm.value.prix), // Convertir en nombre
        images: donneesImages
      };

      console.log('Données envoyées au serveur:', donneesProduit); // Debug

      // 3. Créer le produit
      const reponseProduit = await this.produitsService.creerProduit(donneesProduit).toPromise();

      this.notificationService.success(
        'Produit créé',
        'Votre produit est en attente de modération'
      );

      // Redirection avec un petit délai pour permettre à l'utilisateur de voir le message
      setTimeout(() => {
        this.router.navigate(['/produits/mes-produits']);
      }, 2000);
    } catch (erreur: any) {
      console.error('Erreur création produit:', erreur);
      
      // Amélioration de la gestion des erreurs
      const messageErreur = erreur.error?.message || 
                           erreur.error?.erreur || 
                           erreur.message || 
                           'Une erreur est survenue lors de la création du produit';
      
      this.notificationService.error('Erreur', messageErreur);
    } finally {
      this.enChargement = false;
      this.uploadEnCours = false;
    }
  }

  // === GETTERS ===

  get titre() {
    return this.produitForm.get('titre');
  }

  get description() {
    return this.produitForm.get('description');
  }

  get prix() {
    return this.produitForm.get('prix');
  }

  get categorie() {
    return this.produitForm.get('categorie');
  }

  get etat() {
    return this.produitForm.get('etat');
  }
}