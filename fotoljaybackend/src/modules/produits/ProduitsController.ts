import { type Response } from 'express';
import { type AuthRequest } from '../../middleware/AuthMiddleware.js';
import { ProduitsService } from './ProduitsService.js';
import { ProcesseurImage } from '../../utils/imageProcessor.js';
import { ValidationImage } from '../../utils/imageValidation.js';
import { supprimerFichiers } from '../../utils/imageUpload.js';
import path from 'path';

export class ProduitsController {
  private serviceProduits: ProduitsService;

  constructor() {
    this.serviceProduits = new ProduitsService();
  }

  async creerProduit(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const utilisateurId = req.user!.userId;
      const donnees = req.body;

      console.log('Données reçues:', donnees);

      // Validate required fields
      if (!donnees.titre || !donnees.description || !donnees.prix || !donnees.categorie || !donnees.etat) {
        return res.status(400).json({
          erreur: 'Données invalides ou manquantes',
          details: 'Tous les champs obligatoires doivent être remplis'
        });
      }

      // Validate images array
      if (!donnees.images || !Array.isArray(donnees.images) || donnees.images.length === 0) {
        return res.status(400).json({
          erreur: 'Images invalides',
          details: 'Au moins une image est requise'
        });
      }

      // Remove metadata from images before sending to service
      const imagesSansMetadata = donnees.images.map((img: any) => ({
        url: img.url,
        urlMiniature: img.urlMiniature,
        ordre: img.ordre
      }));

      const produit = await this.serviceProduits.creerProduit(
        donnees,
        utilisateurId,
        imagesSansMetadata
      );

      return res.status(201).json({
        message: 'Produit créé avec succès. En attente de modération.',
        produit
      });

    } catch (erreur: any) {
      console.error('Erreur création produit:', erreur);
      return res.status(400).json({
        erreur: erreur.message,
        details: 'Une erreur est survenue lors de la création du produit'
      });
    }
  }

  async obtenirProduit(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erreur: 'ID manquant' });
      }
      const produit = await this.serviceProduits.obtenirProduit(id, true);

      return res.status(200).json(produit);
    } catch (erreur: any) {
      return res.status(404).json({ erreur: erreur.message });
    }
  }

  async listerProduits(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const filtres = {
        categorie: req.query.categorie as string,
        prixMin: req.query.prixMin ? Number(req.query.prixMin) : undefined,
        prixMax: req.query.prixMax ? Number(req.query.prixMax) : undefined,
        etat: req.query.etat as string,
        recherche: req.query.recherche as string,
        page: req.query.page ? Number(req.query.page) : 1,
        limite: req.query.limite ? Number(req.query.limite) : 20,
      };

      const resultat = await this.serviceProduits.listerProduits(filtres);

      return res.status(200).json(resultat);
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }

  async obtenirMesProduits(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const utilisateurId = req.user!.userId;
      const page = req.query.page ? Number(req.query.page) : 1;
      const limite = req.query.limite ? Number(req.query.limite) : 20;

      const resultat = await this.serviceProduits.obtenirMesProduits(utilisateurId, page, limite);

      return res.status(200).json(resultat);
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }

  async modifierProduit(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erreur: 'ID manquant' });
      }
      const utilisateurId = req.user!.userId;
      const donnees = req.body;

      const produit = await this.serviceProduits.modifierProduit(id, utilisateurId, donnees);

      return res.status(200).json({
        message: 'Produit modifié avec succès',
        produit,
      });
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }

  async supprimerProduit(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erreur: 'ID manquant' });
      }
      const utilisateurId = req.user!.userId;
      const role = req.user!.role;

      await this.serviceProduits.supprimerProduit(id, utilisateurId, role);

      return res.status(200).json({ message: 'Produit supprimé avec succès' });
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }

  async enregistrerContact(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erreur: 'ID manquant' });
      }
      const resultat = await this.serviceProduits.enregistrerContact(id);

      return res.status(200).json(resultat);
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }

  // MODÉRATION

  async listerProduitsEnAttente(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const produits = await this.serviceProduits.listerProduitsEnAttente();

      return res.status(200).json({
        total: produits.length,
        produits,
      });
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }

  async modererProduit(req: AuthRequest, res: Response): Promise<Response> {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ erreur: 'ID manquant' });
      }
      const { statut, raisonRefus } = req.body;

      const produit = await this.serviceProduits.modererProduit(id, statut, raisonRefus);

      return res.status(200).json({
        message: `Produit ${statut === 'APPROUVE' ? 'approuvé' : 'refusé'} avec succès`,
        produit,
      });
    } catch (erreur: any) {
      return res.status(400).json({ erreur: erreur.message });
    }
  }
}