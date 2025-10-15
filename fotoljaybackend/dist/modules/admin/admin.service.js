import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../config/database';
import { DashboardStatsDto, DashboardAlertDto } from './dto/dashboard.dto';
import { UserFiltersDto, UsersResponseDto, UpdateUserStatusDto, UserDto, UserStatus } from './dto/user-management.dto';
import { PendingProductDto, ModerationDecisionDto, ModerationResultDto } from './dto/moderation.dto';
@Injectable()
export class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getDashboardStats() {
        const [totalUsers, activeUsers, totalProducts, pendingProducts, approvedProducts, vipRevenue] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({
                where: {
                    lastLogin: {
                        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                    }
                }
            }),
            this.prisma.product.count(),
            this.prisma.product.count({ where: { status: 'EN_ATTENTE' } }),
            this.prisma.product.count({ where: { status: 'APPROUVE' } }),
            this.prisma.vipSubscription.aggregate({
                _sum: { amount: true }
            }).catch(() => ({ _sum: { amount: 0 } }))
        ]);
        const moderationRate = totalProducts > 0 ?
            (approvedProducts / totalProducts) * 100 : 0;
        return {
            totalUsers,
            activeUsers,
            totalProducts,
            pendingProducts,
            approvedProducts,
            vipRevenue: vipRevenue._sum.amount || 0,
            moderationRate: Math.round(moderationRate * 100) / 100
        };
    }
    async getUsers(filters) {
        const where = {};
        if (filters.role)
            where.role = filters.role;
        if (filters.status)
            where.status = filters.status;
        if (filters.search) {
            where.OR = [
                { nom: { contains: filters.search, mode: 'insensitive' } },
                { email: { contains: filters.search, mode: 'insensitive' } }
            ];
        }
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip: ((filters.page || 1) - 1) * (filters.limit || 20),
                take: filters.limit || 20,
                include: {
                    _count: {
                        select: { products: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.user.count({ where })
        ]);
        return {
            users: users.map(user => ({
                id: user.id,
                nom: user.nom,
                email: user.email,
                telephone: user.telephone,
                role: user.role,
                status: user.status,
                productsCount: user._count.products,
                lastLogin: user.lastLogin?.toISOString(),
                createdAt: user.createdAt.toISOString()
            })),
            total,
            page: filters.page || 1,
            limit: filters.limit || 20
        };
    }
    async updateUserStatus(userId, data) {
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: { status: data.status },
            include: {
                _count: {
                    select: { products: true }
                }
            }
        });
        return {
            id: user.id,
            nom: user.nom,
            email: user.email,
            telephone: user.telephone,
            role: user.role,
            status: user.status,
            productsCount: user._count.products,
            lastLogin: user.lastLogin?.toISOString(),
            createdAt: user.createdAt.toISOString()
        };
    }
    async getPendingProducts() {
        const products = await this.prisma.product.findMany({
            where: { status: 'EN_ATTENTE' },
            include: {
                user: {
                    select: { nom: true, email: true }
                },
                images: true,
                _count: {
                    select: { views: true }
                }
            },
            orderBy: { createdAt: 'asc' }
        });
        return products.map(product => ({
            id: product.id,
            titre: product.titre,
            description: product.description,
            images: product.images.map(img => img.url),
            categorie: product.categorie,
            etat: product.etat,
            prix: product.prix,
            vendeurNom: product.user.nom,
            vendeurEmail: product.user.email,
            dateCreation: product.createdAt.toISOString(),
            vues: product._count.views
        }));
    }
    async moderateProduct(productId, decision, moderatorId) {
        const product = await this.prisma.product.findUnique({
            where: { id: productId }
        });
        if (!product) {
            throw new Error('Produit non trouvé');
        }
        let newStatus;
        switch (decision.decision) {
            case 'APPROUVER':
                newStatus = 'APPROUVE';
                break;
            case 'REFUSER':
                newStatus = 'REFUSE';
                break;
            default:
                newStatus = 'EN_ATTENTE';
        }
        await this.prisma.product.update({
            where: { id: productId },
            data: { status: newStatus }
        });
        // Créer une entrée d'historique de modération
        await this.prisma.moderationHistory.create({
            data: {
                productId,
                moderatorId,
                decision: decision.decision,
                commentaire: decision.commentaire
            }
        });
        return {
            message: `Produit ${decision.decision.toLowerCase()} avec succès`,
            status: newStatus,
            commentaire: decision.commentaire
        };
    }
}
//# sourceMappingURL=admin.service.js.map