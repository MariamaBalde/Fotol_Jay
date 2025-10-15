import { PrismaService } from '../../config/database';
import { DashboardStatsDto } from './dto/dashboard.dto';
import { UserFiltersDto, UsersResponseDto, UpdateUserStatusDto, UserDto } from './dto/user-management.dto';
import { PendingProductDto, ModerationDecisionDto, ModerationResultDto } from './dto/moderation.dto';
export declare class AdminService {
    private prisma;
    constructor(prisma: PrismaService);
    getDashboardStats(): Promise<DashboardStatsDto>;
    getUsers(filters: UserFiltersDto): Promise<UsersResponseDto>;
    updateUserStatus(userId: number, data: UpdateUserStatusDto): Promise<UserDto>;
    getPendingProducts(): Promise<PendingProductDto[]>;
    moderateProduct(productId: number, decision: ModerationDecisionDto, moderatorId: number): Promise<ModerationResultDto>;
}
//# sourceMappingURL=admin.service.d.ts.map