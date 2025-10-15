import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class AdminController {
    // Dashboard - Statistiques générales
    async getDashboardStats(req, res) {
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
                vipConversionRate: 0 // TODO: Implémenter
            });
        }
        catch (error) {
            console.error('Erreur dashboard stats:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
    // Gestion des utilisateurs
    async getUsers(req, res) {
        try {
            const { search = '', role = '', status = '', page = 1, limit = 20 } = req.query;
            const skip = (Number(page) - 1) * Number(limit);
            const where = {};
            if (search) {
                where.OR = [
                    { nom: { contains: search, mode: 'insensitive' } },
                    { prenom: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } }
                ];
            }
            if (role) {
                where.role = role;
            }
            // Compter le nombre de produits par utilisateur
            const users = await prisma.utilisateur.findMany({
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
                orderBy: {
                    dateCreation: 'desc'
                }
            });
            const total = await prisma.utilisateur.count({ where });
            // Transformer les données pour le frontend
            const transformedUsers = users.map(user => ({
                id: user.id,
                nom: user.nom,
                email: user.email,
                telephone: user.telephone,
                role: user.role,
                status: 'ACTIF', // TODO: Implémenter système de statut
                productsCount: user._count.produits,
                createdAt: user.dateCreation.toISOString()
            }));
            res.json({
                users: transformedUsers,
                total,
                page: Number(page),
                limit: Number(limit)
            });
        }
        catch (error) {
            console.error('Erreur récupération utilisateurs:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
    // Modification du statut utilisateur
    async updateUserStatus(req, res) {
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
        }
        catch (error) {
            console.error('Erreur modification statut utilisateur:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
    // Produits en attente de modération
    async getPendingProducts(req, res) {
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
        }
        catch (error) {
            console.error('Erreur récupération produits en attente:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
    // Modération d'un produit
    async moderateProduct(req, res) {
        try {
            const { productId } = req.params;
            const { decision, commentaire } = req.body;
            const moderatorId = req.user.id;
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
            // Mettre à jour le statut du produit
            const newStatus = decision === 'APPROUVER' ? 'APPROUVE' : 'REFUSE';
            await prisma.produit.update({
                where: { id: productId },
                data: {
                    statut: newStatus,
                    raisonRefus: decision === 'REFUSER' ? commentaire : null,
                    dateMiseAJour: new Date()
                    // TODO: Ajouter les champs dateModeration et moderateParId dans le schéma Prisma
                }
            });
            // TODO: Créer une entrée dans l'historique de modération
            res.json({
                message: `Produit ${decision === 'APPROUVER' ? 'approuvé' : 'refusé'} avec succès`,
                status: newStatus,
                commentaire: commentaire || null
            });
        }
        catch (error) {
            console.error('Erreur modération produit:', error);
            res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}
//# sourceMappingURL=admin.controller.js.map