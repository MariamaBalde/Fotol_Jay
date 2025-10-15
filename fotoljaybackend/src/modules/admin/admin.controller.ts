import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class AdminController {

  // Dashboard - Statistiques générales
  async getDashboardStats(req: Request, res: Response) {
    try {
      // Statistiques des utilisateurs
      const totalUsers = await prisma.utilisateur.count();
      const activeUsers = await prisma.utilisateur.count({
        where: {
          // Utilisateurs actifs (avec produits récents ou connexions récentes)
          OR: [
            {
              produits: {
                some: {
                  dateCreation: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // 30 jours
                  }
                }
              }
            }
          ]
        }
      });

      // Statistiques des produits
      const totalProducts = await prisma.produit.count();
      const pendingProducts = await prisma.produit.count({
        where: { statut: 'EN_ATTENTE' }
      });
      const approvedProducts = await prisma.produit.count({
        where: { statut: 'APPROUVE' }
      });

      // Revenus VIP (simulé pour l'instant)
      const vipRevenue = 0; // TODO: Implémenter système de paiement

      // Taux de conversion (contacts établis)
      const totalContacts = await prisma.produit.aggregate({
        _sum: {
          nombreContacts: true
        }
      });
      const totalViews = await prisma.produit.aggregate({
        _sum: {
          vues: true
        }
      });
      const conversionRate = totalViews._sum.vues && totalViews._sum.vues > 0
        ? Math.round((totalContacts._sum.nombreContacts! / totalViews._sum.vues) * 100)
        : 0;

      // Signalements utilisateurs
      const pendingReports = await prisma.signalement.count({
        where: { statut: 'EN_ATTENTE' }
      });

      // Erreurs système récentes (dernières 24h)
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const recentErrors = await prisma.erreurSysteme.count({
        where: {
          niveau: 'ERROR',
          dateCreation: {
            gte: yesterday
          }
        }
      });

      // Métriques de performance
      const avgResponseTime = 0; // TODO: Implémenter tracking des temps de réponse
      const uptime = 99.9; // TODO: Implémenter monitoring uptime

      // Taux de modération
      const moderationRate = totalProducts > 0
        ? Math.round((approvedProducts / totalProducts) * 100)
        : 0;

      // Nouveaux utilisateurs aujourd'hui
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const newUsersToday = await prisma.utilisateur.count({
        where: {
          dateCreation: {
            gte: today
          }
        }
      });

      // Nouveaux utilisateurs cette semaine
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const newUsersThisWeek = await prisma.utilisateur.count({
        where: {
          dateCreation: {
            gte: weekAgo
          }
        }
      });

      res.json({
        totalUsers,
        activeUsers,
        totalProducts,
        pendingProducts,
        approvedProducts,
        vipRevenue,
        moderationRate,
        newUsersToday,
        newUsersThisWeek,
        vipSubscribers: 0, // TODO: Implémenter
        vipConversionRate: 0, // TODO: Implémenter
        conversionRate,
        pendingReports,
        recentErrors,
        avgResponseTime,
        uptime
      });

    } catch (error) {
      console.error('Erreur dashboard stats:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Gestion des utilisateurs
  async getUsers(req: Request, res: Response) {
    try {
      const {
        search = '',
        role = '',
        status = '',
        sortBy = 'date-desc',
        page = 1,
        limit = 20
      } = req.query;

      const skip = (Number(page) - 1) * Number(limit);

      const where: any = {};

      // Recherche par nom, prénom, email, téléphone
      if (search) {
        where.OR = [
          { nom: { contains: search as string } },
          { prenom: { contains: search as string } },
          { email: { contains: search as string } },
          { telephone: { contains: search as string } }
        ];
      }

      // Filtre par rôle
      if (role) {
        where.role = role;
      }

      // Filtre par statut (pour les utilisateurs normaux, on utilise un champ fictif)
      // TODO: Implémenter un vrai système de statut utilisateur dans le schéma Prisma
      if (status && status !== '') {
        // Pour l'instant, on simule - tous les utilisateurs sont "ACTIF"
        // Dans un vrai système, on aurait un champ statutUtilisateur
      }

      // Logique de tri
      let orderBy: any = { dateCreation: 'desc' }; // Tri par défaut

      switch (sortBy) {
        case 'date-desc':
          orderBy = { dateCreation: 'desc' };
          break;
        case 'date-asc':
          orderBy = { dateCreation: 'asc' };
          break;
        case 'products-desc':
          // Pour trier par nombre de produits, on doit faire une requête séparée
          // et trier en JavaScript
          break;
        case 'products-asc':
          // Pour trier par nombre de produits, on doit faire une requête séparée
          // et trier en JavaScript
          break;
        case 'name-asc':
          orderBy = [{ nom: 'asc' }, { prenom: 'asc' }];
          break;
        case 'name-desc':
          orderBy = [{ nom: 'desc' }, { prenom: 'desc' }];
          break;
        default:
          orderBy = { dateCreation: 'desc' };
      }

      // Compter le nombre de produits par utilisateur
      let users = await prisma.utilisateur.findMany({
        where,
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          dateCreation: true,
          _count: {
            select: {
              produits: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy
      });

      const total = await prisma.utilisateur.count({ where });

      // Tri par nombre de produits si demandé (car Prisma ne supporte pas le tri par _count)
      if (sortBy === 'products-desc') {
        users = users.sort((a, b) => b._count.produits - a._count.produits);
      } else if (sortBy === 'products-asc') {
        users = users.sort((a, b) => a._count.produits - b._count.produits);
      }

      // Transformer les données pour le frontend
      const transformedUsers = users.map(user => ({
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        status: 'ACTIF', // TODO: Implémenter système de statut utilisateur
        productsCount: user._count.produits,
        createdAt: user.dateCreation.toISOString()
      }));

      res.json({
        users: transformedUsers,
        total,
        page: Number(page),
        limit: Number(limit)
      });

    } catch (error) {
      console.error('Erreur récupération utilisateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Modification du statut utilisateur
  async updateUserStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      // TODO: Implémenter la logique de changement de statut
      // Pour l'instant, on simule
      const user = await prisma.utilisateur.findUnique({
        where: { id },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          dateCreation: true,
          _count: {
            select: {
              produits: true
            }
          }
        }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Transformer pour le frontend
      const transformedUser = {
        id: user.id,
        nom: user.nom,
        email: user.email,
        telephone: user.telephone,
        role: user.role,
        status: status || 'ACTIF',
        productsCount: user._count.produits,
        createdAt: user.dateCreation.toISOString()
      };

      res.json(transformedUser);

    } catch (error) {
      console.error('Erreur modification statut utilisateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Produits en attente de modération
  async getPendingProducts(req: Request, res: Response) {
    try {
      const pendingProducts = await prisma.produit.findMany({
        where: {
          statut: 'EN_ATTENTE'
        },
        include: {
          utilisateur: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          },
          images: {
            orderBy: {
              ordre: 'asc'
            }
          }
        },
        orderBy: {
          dateCreation: 'desc'
        }
      });

      // Transformer les données
      const transformedProducts = pendingProducts.map(product => ({
        id: product.id,
        titre: product.titre,
        description: product.description,
        images: product.images.map(img => img.url),
        categorie: product.categorie,
        etat: product.etat,
        prix: product.prix,
        vendeurNom: `${product.utilisateur.prenom} ${product.utilisateur.nom}`,
        vendeurEmail: product.utilisateur.email,
        dateCreation: product.dateCreation.toISOString(),
        vues: product.vues
      }));

      res.json(transformedProducts);

    } catch (error) {
      console.error('Erreur récupération produits en attente:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Modération d'un produit
  async moderateProduct(req: Request, res: Response) {
    try {
      const { productId } = req.params;
      const { decision, commentaire } = req.body;
      const moderatorId = (req as any).user.id;
      const startTime = Date.now();

      // Vérifier que le produit existe et est en attente
      const product = await prisma.produit.findUnique({
        where: { id: productId }
      });

      if (!product) {
        return res.status(404).json({ message: 'Produit non trouvé' });
      }

      if (product.statut !== 'EN_ATTENTE') {
        return res.status(400).json({ message: 'Produit déjà modéré' });
      }

      // Calculer le temps de décision
      const decisionTime = Date.now() - startTime;

      // Mettre à jour le statut du produit
      const newStatus = decision === 'APPROUVER' ? 'APPROUVE' : 'REFUSE';

      await prisma.produit.update({
        where: { id: productId },
        data: {
          statut: newStatus,
          raisonRefus: decision === 'REFUSER' ? commentaire : null,
          dateMiseAJour: new Date()
        }
      });

      // Créer une entrée dans l'historique de modération
      await prisma.decisionModeration.create({
        data: {
          produitId: productId,
          moderateParId: moderatorId,
          decision: decision,
          commentaire: commentaire || null,
          tempsDecision: decisionTime
        }
      });

      res.json({
        message: `Produit ${decision === 'APPROUVER' ? 'approuvé' : 'refusé'} avec succès`,
        status: newStatus,
        commentaire: commentaire || null
      });

    } catch (error) {
      console.error('Erreur modération produit:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Gestion des signalements
  async getReports(req: Request, res: Response) {
    try {
      const { status = 'EN_ATTENTE', page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const reports = await prisma.signalement.findMany({
        where: { statut: status as string },
        include: {
          signaleur: {
            select: { id: true, nom: true, prenom: true, email: true }
          },
          traitePar: {
            select: { id: true, nom: true, prenom: true }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { dateCreation: 'desc' }
      });

      const total = await prisma.signalement.count({ where: { statut: status as string } });

      res.json({
        reports,
        total,
        page: Number(page),
        limit: Number(limit)
      });

    } catch (error) {
      console.error('Erreur récupération signalements:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Traiter un signalement
  async processReport(req: Request, res: Response) {
    try {
      const { reportId } = req.params;
      const { action, commentaire } = req.body;
      const moderatorId = (req as any).user.id;

      const newStatus = action === 'TRAITER' ? 'TRAITE' : 'REJETE';

      await prisma.signalement.update({
        where: { id: reportId },
        data: {
          statut: newStatus,
          traiteParId: moderatorId,
          dateTraitement: new Date()
        }
      });

      res.json({ message: `Signalement ${newStatus.toLowerCase()}` });

    } catch (error) {
      console.error('Erreur traitement signalement:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Gestion des modérateurs
  async getModerators(req: Request, res: Response) {
    try {
      const moderators = await prisma.utilisateur.findMany({
        where: {
          role: { in: ['MODERATEUR', 'ADMINISTRATEUR'] }
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          statutModerateur: true,
          dateCreation: true,
          _count: {
            select: {
              signalementsTraites: true,
              decisionsModeration: true,
              feedbacksModerateur: true
            }
          }
        }
      });

      // Calculer les statistiques pour chaque modérateur
      const moderatorsWithStats = await Promise.all(
        moderators.map(async (moderator) => {
          // Statistiques du mois en cours
          const currentMonth = new Date();
          currentMonth.setDate(1);
          currentMonth.setHours(0, 0, 0, 0);

          const decisionsThisMonth = await prisma.decisionModeration.count({
            where: {
              moderateParId: moderator.id,
              dateCreation: {
                gte: currentMonth
              }
            }
          });

          const approvedThisMonth = await prisma.decisionModeration.count({
            where: {
              moderateParId: moderator.id,
              decision: 'APPROUVER',
              dateCreation: {
                gte: currentMonth
              }
            }
          });

          const acceptanceRate = decisionsThisMonth > 0
            ? Math.round((approvedThisMonth / decisionsThisMonth) * 100)
            : 0;

          // Temps moyen de modération
          const avgModerationTime = await prisma.decisionModeration.aggregate({
            where: { moderateParId: moderator.id },
            _avg: { tempsDecision: true }
          });

          // Note moyenne des feedbacks
          const avgRating = await prisma.feedbackModerateur.aggregate({
            where: { moderateurId: moderator.id },
            _avg: { note: true }
          });

          return {
            ...moderator,
            stats: {
              productsModeratedThisMonth: decisionsThisMonth,
              acceptanceRate,
              avgModerationTime: Math.round(avgModerationTime._avg.tempsDecision || 0),
              avgRating: Math.round((avgRating._avg.note || 0) * 10) / 10,
              totalFeedbacks: moderator._count.feedbacksModerateur
            }
          };
        })
      );

      res.json(moderatorsWithStats);

    } catch (error) {
      console.error('Erreur récupération modérateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Changer le rôle d'un utilisateur
  async updateUserRole(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { role } = req.body;

      await prisma.utilisateur.update({
        where: { id: userId },
        data: { role }
      });

      res.json({ message: 'Rôle mis à jour avec succès' });

    } catch (error) {
      console.error('Erreur mise à jour rôle:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Créer un nouveau modérateur
  async createModerator(req: Request, res: Response) {
    try {
      const { nom, prenom, email, telephone, motDePasse } = req.body;

      // Vérifier si l'email existe déjà
      const existingUser = await prisma.utilisateur.findUnique({
        where: { email }
      });

      if (existingUser) {
        return res.status(400).json({ message: 'Cet email est déjà utilisé' });
      }

      // Créer le modérateur
      const moderator = await prisma.utilisateur.create({
        data: {
          nom,
          prenom,
          email,
          telephone,
          motDePasse, // TODO: Hasher le mot de passe
          role: 'MODERATEUR',
          statutModerateur: 'ACTIF'
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          statutModerateur: true,
          dateCreation: true
        }
      });

      res.status(201).json(moderator);

    } catch (error) {
      console.error('Erreur création modérateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Mettre à jour le statut d'un modérateur
  async updateModeratorStatus(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { statut } = req.body;

      await prisma.utilisateur.update({
        where: { id: userId },
        data: { statutModerateur: statut }
      });

      res.json({ message: 'Statut mis à jour avec succès' });

    } catch (error) {
      console.error('Erreur mise à jour statut modérateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Supprimer un modérateur
  async deleteModerator(req: Request, res: Response) {
    try {
      const { userId } = req.params;

      // Vérifier que l'utilisateur existe et est un modérateur/administrateur
      const moderator = await prisma.utilisateur.findUnique({
        where: { id: userId },
        select: {
          id: true,
          role: true,
          nom: true,
          prenom: true,
          _count: {
            select: {
              decisionsModeration: true,
              signalementsTraites: true
            }
          }
        }
      });

      if (!moderator) {
        return res.status(404).json({ message: 'Modérateur non trouvé' });
      }

      if (!['MODERATEUR', 'ADMINISTRATEUR'].includes(moderator.role)) {
        return res.status(400).json({ message: 'Cet utilisateur n\'est pas un modérateur' });
      }

      // Option 1: Suppression douce - changer le rôle à UTILISATEUR
      // Cela préserve l'historique des décisions
      await prisma.utilisateur.update({
        where: { id: userId },
        data: {
          role: 'UTILISATEUR',
          statutModerateur: null // Supprimer le statut modérateur
        }
      });

      res.json({
        message: `Modérateur ${moderator.prenom} ${moderator.nom} supprimé avec succès. L'utilisateur reste dans le système avec le rôle UTILISATEUR.`,
        preservedData: {
          decisionsCount: moderator._count.decisionsModeration,
          reportsHandledCount: moderator._count.signalementsTraites
        }
      });

    } catch (error) {
      console.error('Erreur suppression modérateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Mettre à jour les informations d'un modérateur
  async updateModerator(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const { nom, prenom, email, telephone } = req.body;

      // Vérifier que l'utilisateur existe et est un modérateur/administrateur
      const existingUser = await prisma.utilisateur.findUnique({
        where: { id: userId }
      });

      if (!existingUser) {
        return res.status(404).json({ message: 'Modérateur non trouvé' });
      }

      if (!['MODERATEUR', 'ADMINISTRATEUR'].includes(existingUser.role)) {
        return res.status(400).json({ message: 'Cet utilisateur n\'est pas un modérateur' });
      }

      // Vérifier si l'email est déjà utilisé par un autre utilisateur
      if (email !== existingUser.email) {
        const emailExists = await prisma.utilisateur.findUnique({
          where: { email }
        });

        if (emailExists) {
          return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
      }

      // Mettre à jour les informations
      const updatedModerator = await prisma.utilisateur.update({
        where: { id: userId },
        data: {
          nom,
          prenom,
          email,
          telephone,
          dateMiseAJour: new Date()
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          email: true,
          telephone: true,
          role: true,
          statutModerateur: true,
          dateMiseAJour: true
        }
      });

      res.json({
        message: 'Informations du modérateur mises à jour avec succès',
        moderator: updatedModerator
      });

    } catch (error) {
      console.error('Erreur mise à jour modérateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Obtenir l'historique des décisions d'un modérateur
  async getModeratorHistory(req: Request, res: Response) {
    try {
      const { moderatorId } = req.params;
      const { page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const decisions = await prisma.decisionModeration.findMany({
        where: { moderateParId: moderatorId },
        include: {
          produit: {
            select: {
              id: true,
              titre: true,
              categorie: true,
              utilisateur: {
                select: { nom: true, prenom: true }
              }
            }
          }
        },
        orderBy: { dateCreation: 'desc' },
        skip,
        take: Number(limit)
      });

      const total = await prisma.decisionModeration.count({
        where: { moderateParId: moderatorId }
      });

      res.json({
        decisions,
        total,
        page: Number(page),
        limit: Number(limit)
      });

    } catch (error) {
      console.error('Erreur récupération historique modérateur:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Classement des modérateurs par performance
  async getModeratorRanking(req: Request, res: Response) {
    try {
      const moderators = await prisma.utilisateur.findMany({
        where: {
          role: { in: ['MODERATEUR', 'ADMINISTRATEUR'] }
        },
        select: {
          id: true,
          nom: true,
          prenom: true,
          _count: {
            select: {
              decisionsModeration: true
            }
          }
        }
      });

      // Calculer les métriques de performance
      const ranking = await Promise.all(
        moderators.map(async (moderator) => {
          const totalDecisions = moderator._count.decisionsModeration;

          const approvedDecisions = await prisma.decisionModeration.count({
            where: {
              moderateParId: moderator.id,
              decision: 'APPROUVER'
            }
          });

          const acceptanceRate = totalDecisions > 0 ? (approvedDecisions / totalDecisions) * 100 : 0;

          const avgTime = await prisma.decisionModeration.aggregate({
            where: { moderateParId: moderator.id },
            _avg: { tempsDecision: true }
          });

          const avgRating = await prisma.feedbackModerateur.aggregate({
            where: { moderateurId: moderator.id },
            _avg: { note: true }
          });

          // Score composite (pondéré)
          const score = (acceptanceRate * 0.4) + ((5 - (avgTime._avg.tempsDecision || 0) / 1000) * 20 * 0.3) + ((avgRating._avg.note || 3) * 20 * 0.3);

          return {
            id: moderator.id,
            nom: `${moderator.prenom} ${moderator.nom}`,
            totalDecisions,
            acceptanceRate: Math.round(acceptanceRate),
            avgModerationTime: Math.round(avgTime._avg.tempsDecision || 0),
            avgRating: Math.round((avgRating._avg.note || 0) * 10) / 10,
            score: Math.round(score)
          };
        })
      );

      // Trier par score décroissant
      ranking.sort((a, b) => b.score - a.score);

      res.json(ranking);

    } catch (error) {
      console.error('Erreur récupération classement modérateurs:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Soumettre un feedback pour un modérateur
  async submitModeratorFeedback(req: Request, res: Response) {
    try {
      const { moderatorId } = req.params;
      const { note, commentaire, type } = req.body;
      const userId = (req as any).user.id;

      const feedback = await prisma.feedbackModerateur.create({
        data: {
          moderateurId: moderatorId,
          utilisateurId: userId,
          note,
          commentaire,
          type
        }
      });

      res.status(201).json(feedback);

    } catch (error) {
      console.error('Erreur soumission feedback:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Paramètres VIP
  async getVipSettings(req: Request, res: Response) {
    try {
      const settings = await prisma.parametreVIP.findMany({
        orderBy: { cle: 'asc' }
      });

      res.json(settings);

    } catch (error) {
      console.error('Erreur récupération paramètres VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async updateVipSetting(req: Request, res: Response) {
    try {
      const { key } = req.params;
      const { valeur } = req.body;

      await prisma.parametreVIP.upsert({
        where: { cle: key },
        update: { valeur },
        create: { cle: key, valeur }
      });

      res.json({ message: 'Paramètre mis à jour' });

    } catch (error) {
      console.error('Erreur mise à jour paramètre VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Tarification VIP
  async getVipPricing(req: Request, res: Response) {
    try {
      const pricing = await prisma.tarificationVIP.findMany({
        where: { estActif: true },
        orderBy: { duree: 'asc' }
      });

      res.json(pricing);

    } catch (error) {
      console.error('Erreur récupération tarification VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async createVipPricing(req: Request, res: Response) {
    try {
      const { duree, prix, devise, reductionPourcent } = req.body;

      const pricing = await prisma.tarificationVIP.create({
        data: {
          duree,
          prix,
          devise: devise || 'XOF',
          reductionPourcent
        }
      });

      res.status(201).json(pricing);

    } catch (error) {
      console.error('Erreur création tarification VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async updateVipPricing(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { prix, reductionPourcent, estActif } = req.body;

      const pricing = await prisma.tarificationVIP.update({
        where: { id },
        data: {
          prix,
          reductionPourcent,
          estActif
        }
      });

      // Historiser le changement de prix
      if (prix !== pricing.prix) {
        await prisma.historiquePrixVIP.create({
          data: {
            duree: pricing.duree,
            ancienPrix: pricing.prix,
            nouveauPrix: prix,
            devise: pricing.devise,
            modifieParId: (req as any).user.id
          }
        });
      }

      res.json(pricing);

    } catch (error) {
      console.error('Erreur mise à jour tarification VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Codes promo VIP
  async getVipPromoCodes(req: Request, res: Response) {
    try {
      const promoCodes = await prisma.codePromoVIP.findMany({
        where: { estActif: true },
        orderBy: { dateCreation: 'desc' }
      });

      res.json(promoCodes);

    } catch (error) {
      console.error('Erreur récupération codes promo VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async createVipPromoCode(req: Request, res: Response) {
    try {
      const { code, description, reductionPourcent, reductionMontant, dureeBonus, utilisationsMax, dateExpiration } = req.body;

      const promoCode = await prisma.codePromoVIP.create({
        data: {
          code,
          description,
          reductionPourcent,
          reductionMontant,
          dureeBonus,
          utilisationsMax,
          dateExpiration: dateExpiration ? new Date(dateExpiration) : null
        }
      });

      res.status(201).json(promoCode);

    } catch (error) {
      console.error('Erreur création code promo VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async updateVipPromoCode(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { estActif } = req.body;

      const promoCode = await prisma.codePromoVIP.update({
        where: { id },
        data: { estActif }
      });

      res.json(promoCode);

    } catch (error) {
      console.error('Erreur mise à jour code promo VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Gestion des abonnements VIP
  async getVipSubscriptions(req: Request, res: Response) {
    try {
      const { status = 'ACTIF', page = 1, limit = 20 } = req.query;
      const skip = (Number(page) - 1) * Number(limit);

      const subscriptions = await prisma.abonnementVIP.findMany({
        where: { statut: status as string },
        include: {
          utilisateur: {
            select: {
              id: true,
              nom: true,
              prenom: true,
              email: true
            }
          }
        },
        skip,
        take: Number(limit),
        orderBy: { dateCreation: 'desc' }
      });

      const total = await prisma.abonnementVIP.count({ where: { statut: status as string } });

      res.json({
        subscriptions,
        total,
        page: Number(page),
        limit: Number(limit)
      });

    } catch (error) {
      console.error('Erreur récupération abonnements VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async createVipSubscription(req: Request, res: Response) {
    try {
      const { utilisateurId, duree, codePromo } = req.body;

      // Vérifier que l'utilisateur existe
      const user = await prisma.utilisateur.findUnique({
        where: { id: utilisateurId }
      });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }

      // Récupérer la tarification
      const pricing = await prisma.tarificationVIP.findFirst({
        where: { duree, estActif: true }
      });

      if (!pricing) {
        return res.status(404).json({ message: 'Tarification non trouvée' });
      }

      let prixTotal = pricing.prix;
      let dureeBonus = 0;

      // Appliquer le code promo si fourni
      if (codePromo) {
        const promo = await prisma.codePromoVIP.findUnique({
          where: { code: codePromo }
        });

        if (promo && promo.estActif && (!promo.dateExpiration || promo.dateExpiration > new Date())) {
          if (promo.reductionPourcent) {
            prixTotal -= prixTotal * (promo.reductionPourcent / 100);
          }
          if (promo.reductionMontant) {
            prixTotal -= promo.reductionMontant;
          }
          if (promo.dureeBonus) {
            dureeBonus = promo.dureeBonus;
          }

          // Incrémenter les utilisations
          await prisma.codePromoVIP.update({
            where: { code: codePromo },
            data: { utilisationsActuelles: { increment: 1 } }
          });
        }
      }

      const dateDebut = new Date();
      const dateFin = new Date();
      dateFin.setDate(dateFin.getDate() + duree + dureeBonus);

      // Créer l'abonnement
      const subscription = await prisma.abonnementVIP.create({
        data: {
          utilisateurId,
          dateDebut,
          dateFin,
          duree: duree + dureeBonus,
          prixTotal,
          codePromo
        }
      });

      // Mettre à jour le rôle de l'utilisateur
      await prisma.utilisateur.update({
        where: { id: utilisateurId },
        data: {
          role: 'VIP',
          finVip: dateFin
        }
      });

      res.status(201).json(subscription);

    } catch (error) {
      console.error('Erreur création abonnement VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async extendVipSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      const { dureeSupplementaire } = req.body;

      const subscription = await prisma.abonnementVIP.findUnique({
        where: { id: subscriptionId }
      });

      if (!subscription) {
        return res.status(404).json({ message: 'Abonnement non trouvé' });
      }

      const pricing = await prisma.tarificationVIP.findFirst({
        where: { duree: dureeSupplementaire, estActif: true }
      });

      if (!pricing) {
        return res.status(404).json({ message: 'Tarification non trouvée' });
      }

      const nouvelleDateFin = new Date(subscription.dateFin);
      nouvelleDateFin.setDate(nouvelleDateFin.getDate() + dureeSupplementaire);

      await prisma.abonnementVIP.update({
        where: { id: subscriptionId },
        data: {
          dateFin: nouvelleDateFin,
          duree: subscription.duree + dureeSupplementaire,
          prixTotal: subscription.prixTotal + pricing.prix
        }
      });

      // Mettre à jour finVip de l'utilisateur
      await prisma.utilisateur.update({
        where: { id: subscription.utilisateurId },
        data: { finVip: nouvelleDateFin }
      });

      res.json({ message: 'Abonnement étendu avec succès' });

    } catch (error) {
      console.error('Erreur extension abonnement VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  async refundVipSubscription(req: Request, res: Response) {
    try {
      const { subscriptionId } = req.params;
      const { raison } = req.body;

      const subscription = await prisma.abonnementVIP.findUnique({
        where: { id: subscriptionId }
      });

      if (!subscription) {
        return res.status(404).json({ message: 'Abonnement non trouvé' });
      }

      if (subscription.statut === 'REMBOURSE') {
        return res.status(400).json({ message: 'Abonnement déjà remboursé' });
      }

      await prisma.abonnementVIP.update({
        where: { id: subscriptionId },
        data: { statut: 'REMBOURSE' }
      });

      // Remettre l'utilisateur en UTILISATEUR
      await prisma.utilisateur.update({
        where: { id: subscription.utilisateurId },
        data: {
          role: 'UTILISATEUR',
          finVip: null
        }
      });

      res.json({ message: 'Abonnement remboursé avec succès' });

    } catch (error) {
      console.error('Erreur remboursement abonnement VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Analytics VIP
  async getVipAnalytics(req: Request, res: Response) {
    try {
      // Revenus totaux VIP
      const totalRevenue = await prisma.abonnementVIP.aggregate({
        _sum: { prixTotal: true },
        where: { statut: { in: ['ACTIF', 'EXPIRE'] } }
      });

      // Nombre d'abonnements actifs
      const activeSubscriptions = await prisma.abonnementVIP.count({
        where: {
          statut: 'ACTIF',
          dateFin: { gte: new Date() }
        }
      });

      // Taux de conversion VIP
      const totalUsers = await prisma.utilisateur.count();
      const vipUsers = await prisma.utilisateur.count({
        where: { role: 'VIP' }
      });
      const vipConversionRate = totalUsers > 0 ? (vipUsers / totalUsers) * 100 : 0;

      // Durée moyenne d'abonnement
      const avgSubscriptionDuration = await prisma.abonnementVIP.aggregate({
        _avg: { duree: true },
        where: { statut: { in: ['ACTIF', 'EXPIRE'] } }
      });

      // Churn rate (abonnements expirés dans les 30 derniers jours)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const expiredSubscriptions = await prisma.abonnementVIP.count({
        where: {
          statut: 'EXPIRE',
          dateFin: {
            gte: thirtyDaysAgo,
            lt: new Date()
          }
        }
      });

      const totalActiveAtPeriod = await prisma.abonnementVIP.count({
        where: {
          OR: [
            { statut: 'ACTIF' },
            {
              statut: 'EXPIRE',
              dateFin: { gte: thirtyDaysAgo }
            }
          ]
        }
      });

      const churnRate = totalActiveAtPeriod > 0 ? (expiredSubscriptions / totalActiveAtPeriod) * 100 : 0;

      // Revenus par période (dernier mois)
      const monthlyRevenue = await prisma.abonnementVIP.aggregate({
        _sum: { prixTotal: true },
        where: {
          dateCreation: { gte: thirtyDaysAgo },
          statut: { in: ['ACTIF', 'EXPIRE'] }
        }
      });

      res.json({
        totalRevenue: totalRevenue._sum.prixTotal || 0,
        monthlyRevenue: monthlyRevenue._sum.prixTotal || 0,
        activeSubscriptions,
        vipConversionRate: Math.round(vipConversionRate * 100) / 100,
        avgSubscriptionDuration: Math.round(avgSubscriptionDuration._avg.duree || 0),
        churnRate: Math.round(churnRate * 100) / 100
      });

    } catch (error) {
      console.error('Erreur récupération analytics VIP:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }

  // Export des rapports
  async exportReports(req: Request, res: Response) {
    try {
      const { type } = req.params;
      const { format = 'json' } = req.query;

      let data: any = {};

      switch (type) {
        case 'users':
          data = await prisma.utilisateur.findMany({
            select: {
              id: true,
              nom: true,
              email: true,
              role: true,
              dateCreation: true,
              _count: { select: { produits: true } }
            }
          });
          break;

        case 'products':
          data = await prisma.produit.findMany({
            include: {
              utilisateur: { select: { nom: true, email: true } },
              _count: { select: { images: true } }
            }
          });
          break;

        case 'reports':
          data = await prisma.signalement.findMany({
            include: {
              signaleur: { select: { nom: true, email: true } }
            }
          });
          break;

        default:
          return res.status(400).json({ message: 'Type de rapport invalide' });
      }

      if (format === 'csv') {
        // TODO: Implémenter conversion CSV
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="report.json"');
      } else {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', 'attachment; filename="report.json"');
      }

      res.json(data);

    } catch (error) {
      console.error('Erreur export rapport:', error);
      res.status(500).json({ message: 'Erreur serveur' });
    }
  }
}