import { StatutProduit, type Produit, Prisma } from '@prisma/client';
import prisma from '../../config/database.js';

export interface FiltresProduits {
  categorie?: string | undefined;
  prixMin?: number | undefined;
  prixMax?: number | undefined;
  etat?: string | undefined;
  recherche?: string | undefined;
  page?: number;
  limite?: number;
  statut?: StatutProduit;
  utilisateurId?: string;
}

export class ProduitsRepository {
  // Créer un produit
  async creer(donnees: {
    titre: string;
    description: string;
    prix: number;
    categorie: string;
    etat: string;
    localisation?: string;
    utilisateurId: string;
    dateExpiration: Date;
    images?: { url: string; urlMiniature?: string; ordre: number }[];
  }) {
    const { images, utilisateurId, ...donneeProduit } = donnees;

    const data: Prisma.ProduitCreateInput = {
      ...donneeProduit,
      utilisateur: {
        connect: { id: utilisateurId }
      },
      images: {
        create: images?.map(img => ({
          url: img.url,
          urlMiniature: img.urlMiniature,
          ordre: img.ordre
        })) ?? []
      }
    };

    return await prisma.produit.create({
      data,
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            telephone: true,
            email: true,
            localisation: true,
            role: true,
          },
        },
        images: {
          orderBy: {
            ordre: 'asc',
          },
        },
      },
    });
  }

  // Ajouter des images au produit
  async ajouterImages(produitId: string, images: { url: string; urlMiniature?: string; ordre: number }[]) {
    return await prisma.imageProduit.createMany({
      data: images.map((img) => ({
        ...img,
        produitId,
      })),
    });
  }

  // Trouver un produit par ID
  async trouverParId(id: string) {
    return await prisma.produit.findUnique({
      where: { id },
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            telephone: true,
            email: true,
            localisation: true,
            role: true,
            finVip: true,
          },
        },
        images: {
          orderBy: { ordre: 'asc' },
        },
      },
    });
  }

  // Lister les produits avec filtres
  async lister(filtres: FiltresProduits) {
    const {
      categorie,
      prixMin,
      prixMax,
      etat,
      recherche,
      page = 1,
      limite = 20,
      statut = StatutProduit.APPROUVE,
      utilisateurId,
    } = filtres;

    const skip = (page - 1) * limite;

    const where: any = {
      statut,
      ...(utilisateurId && { utilisateurId }),
      ...(categorie && { categorie }),
      ...(etat && { etat }),
      ...(prixMin && { prix: { gte: prixMin } }),
      ...(prixMax && { prix: { lte: prixMax } }),
    };

    if (prixMin && prixMax) {
      where.prix = { gte: prixMin, lte: prixMax };
    }

    if (recherche) {
      where.OR = [
        { titre: { contains: recherche, mode: 'insensitive' } },
        { description: { contains: recherche, mode: 'insensitive' } },
      ];
    }

    const [produits, total] = await Promise.all([
      prisma.produit.findMany({
        where,
        include: {
          utilisateur: {
            select: {
              id: true,
              prenom: true,
              nom: true,
              telephone: true,
              localisation: true,
              role: true,
              finVip: true,
            },
          },
          images: {
            orderBy: { ordre: 'asc' },
            take: 1, // Seulement la première image pour la liste
          },
        },
        orderBy: [
          // Priorité aux produits VIP
          { utilisateur: { finVip: 'desc' } },
          // Puis par date de création
          { dateCreation: 'desc' },
        ],
        skip,
        take: limite,
      }),
      prisma.produit.count({ where }),
    ]);

    return {
      produits,
      pagination: {
        page,
        limite,
        total,
        totalPages: Math.ceil(total / limite),
      },
    };
  }

  // Mettre à jour un produit
  async mettreAJour(id: string, donnees: Partial<Produit>) {
    return await prisma.produit.update({
      where: { id },
      data: donnees,
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            telephone: true,
            localisation: true,
          },
        },
        images: {
          orderBy: { ordre: 'asc' },
        },
      },
    });
  }

  // Supprimer un produit
  async supprimer(id: string) {
    return await prisma.produit.delete({
      where: { id },
    });
  }

  // Incrémenter les vues
  async incrementerVues(id: string) {
    return await prisma.produit.update({
      where: { id },
      data: {
        vues: { increment: 1 },
      },
    });
  }

  // Incrémenter les contacts
  async incrementerContacts(id: string) {
    return await prisma.produit.update({
      where: { id },
      data: {
        nombreContacts: { increment: 1 },
      },
    });
  }

  // Lister les produits en attente de modération
  async listerEnAttente() {
    return await prisma.produit.findMany({
      where: { statut: StatutProduit.EN_ATTENTE },
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            email: true,
          },
        },
        images: {
          orderBy: { ordre: 'asc' },
        },
      },
      orderBy: { dateCreation: 'asc' },
    });
  }

  // Modérer un produit
  async moderer(id: string, statut: StatutProduit, raisonRefus?: string) {
    return await prisma.produit.update({
      where: { id },
      data: {
        statut,
        ...(raisonRefus && { raisonRefus }),
      },
      include: {
        utilisateur: true,
      },
    });
  }

  // Trouver les produits expirés
  async trouverExpires() {
    return await prisma.produit.findMany({
      where: {
        dateExpiration: { lte: new Date() },
        statut: StatutProduit.APPROUVE,
      },
      include: {
        utilisateur: {
          select: {
            id: true,
            prenom: true,
            nom: true,
            email: true,
          },
        },
      },
    });
  }

  // Marquer comme expiré
  async marquerCommeExpire(ids: string[]) {
    return await prisma.produit.updateMany({
      where: { id: { in: ids } },
      data: { statut: StatutProduit.EXPIRE },
    });
  }
}