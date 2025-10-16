import { ProduitsRepository } from './ProduitsRepository.js';
import type { FiltresProduits } from './ProduitsRepository.js';
import { NotificationsService } from '../notifications/NotificationsService.js';
import { ProduitsCloudinaryService } from './ProduitsCloudinaryService.js';
import { StatutProduit } from '@prisma/client';


export class ProduitsService {
  private repository: ProduitsRepository;
    private serviceNotifications: NotificationsService;


  constructor() {
    this.repository = new ProduitsRepository();
    this.serviceNotifications = new NotificationsService();

  }

  // Créer un nouveau produit
  async creerProduit(
    donnees: CreateProduitDto,
    utilisateurId: string,
    images: ImageProduitDto[]
  ) {
    // Vérifier qu'il y a au moins une image
    if (!images || images.length === 0) {
      throw new Error('Au moins une image est requise');
    }

    if (images.length > 5) {
      throw new Error('Maximum 5 images autorisées');
    }

    // Calculer la date d'expiration (7 jours)
    const dateExpiration = new Date();
    dateExpiration.setDate(dateExpiration.getDate() + 7);

    // Créer le produit AVEC les images (elles sont incluses dans repository.creer())
    const produit = await this.repository.creer({
      ...donnees,
      utilisateurId,
      dateExpiration,
      images, // Les images sont passées directement ici
    });

    // NE PAS appeler ajouterImages() car les images sont déjà créées ci-dessus
    // await this.repository.ajouterImages(produit.id, images);

    // Recharger avec les images
    return await this.repository.trouverParId(produit.id);
  }

  // Obtenir les détails d'un produit
  async obtenirProduit(id: string, incrementerVue: boolean = true) {
    const produit = await this.repository.trouverParId(id);

    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    // Incrémenter les vues si demandé
    if (incrementerVue && produit.statut === StatutProduit.APPROUVE) {
      await this.repository.incrementerVues(id);
      produit.vues += 1;
    }

    return produit;
  }

  // Lister les produits avec filtres
  async listerProduits(filtres: FiltresProduits) {
    return await this.repository.lister(filtres);
  }

  // Obtenir mes produits
  async obtenirMesProduits(utilisateurId: string, page: number = 1, limite: number = 20) {
    return await this.repository.lister({
      utilisateurId,
      page,
      limite,
      statut: undefined as any, // Tous les statuts
    });
  }

  // Modifier un produit
  async modifierProduit(
    id: string,
    utilisateurId: string,
    donnees: {
      titre?: string;
      description?: string;
      prix?: number;
      categorie?: string;
      etat?: string;
    }
  ) {
    const produit = await this.repository.trouverParId(id);

    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    if (produit.utilisateurId !== utilisateurId) {
      throw new Error('Vous n\'êtes pas autorisé à modifier ce produit');
    }

    if (produit.statut !== StatutProduit.EN_ATTENTE && produit.statut !== StatutProduit.REFUSE) {
      throw new Error('Ce produit ne peut plus être modifié');
    }

    return await this.repository.mettreAJour(id, donnees);
  }

  // Supprimer un produit
  async supprimerProduit(id: string, utilisateurId: string, role: string) {
    const produit = await this.repository.trouverParId(id);

    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    // Seul le propriétaire ou un admin peut supprimer
    if (produit.utilisateurId !== utilisateurId && role !== 'ADMINISTRATEUR') {
      throw new Error('Vous n\'êtes pas autorisé à supprimer ce produit');
    }

    return await this.repository.supprimer(id);
  }



  // Modération : Lister les produits en attente
  async listerProduitsEnAttente() {
    return await this.repository.listerEnAttente();
  }

  // Modération : Approuver ou refuser un produit
  async modererProduit(id: string, statut: 'APPROUVE' | 'REFUSE', raisonRefus?: string) {
    const produit = await this.repository.trouverParId(id);

    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    if (produit.statut !== StatutProduit.EN_ATTENTE) {
      throw new Error('Ce produit a déjà été modéré');
    }

    if (statut === 'REFUSE' && !raisonRefus) {
      throw new Error('La raison du refus est requise');
    }

    // Si le produit est approuvé, uploader les images sur Cloudinary
    if (statut === 'APPROUVE') {
      await ProduitsCloudinaryService.uploadToCloudinary(id);
    }

    const produitModere = await this.repository.moderer(
      id,
      statut === 'APPROUVE' ? StatutProduit.APPROUVE : StatutProduit.REFUSE,
      raisonRefus
    );

    // Envoyer une notification à l'utilisateur
    if (statut === 'APPROUVE') {
      await this.serviceNotifications.notifierProduitApprouve(
        produit.utilisateurId,
        produit.titre,
        produit.id
      );
    } else {
      await this.serviceNotifications.notifierProduitRefuse(
        produit.utilisateurId,
        produit.titre,
        raisonRefus!
      );
    }

    return produitModere;
  }

  // Cron : Marquer les produits expirés
  async gererProduitsExpires() {
    const produitsExpires = await this.repository.trouverExpires();

    if (produitsExpires.length === 0) {
      return { message: 'Aucun produit expiré' };
    }

    const ids = produitsExpires.map((p) => p.id);
    await this.repository.marquerCommeExpire(ids);

    // TODO: Envoyer des notifications
    // for (const produit of produitsExpires) {
    //   await notificationService.envoyer(...)
    // }

    return {
      message: `${produitsExpires.length} produit(s) expiré(s)`,
      produits: produitsExpires,
    };
  }


  // Modifier la méthode enregistrerContact
  async enregistrerContact(id: string) {
    const produit = await this.repository.trouverParId(id);

    if (!produit) {
      throw new Error('Produit non trouvé');
    }

    if (produit.statut !== StatutProduit.APPROUVE) {
      throw new Error('Ce produit n\'est pas disponible');
    }

    await this.repository.incrementerContacts(id);

    // Notifier le vendeur
    await this.serviceNotifications.notifierContactRecu(
      produit.utilisateurId,
      produit.titre,
      produit.id
    );

    return { message: 'Contact enregistré' };
  }
}

interface CreateProduitDto {
  titre: string;
  description: string;
  prix: number;
  categorie: string;
  etat: string;
  localisation?: string;
}

interface ImageProduitDto {
  url: string;
  urlMiniature?: string;
  ordre: number;
}