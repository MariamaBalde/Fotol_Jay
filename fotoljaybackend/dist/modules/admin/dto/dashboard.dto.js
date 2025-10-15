import { IsOptional, IsString, IsNumber, IsDateString } from 'class-validator';
export class DashboardStatsDto {
    @IsNumber()
    totalUsers;
    @IsNumber()
    activeUsers;
    @IsNumber()
    totalProducts;
    @IsNumber()
    pendingProducts;
    @IsNumber()
    approvedProducts;
    @IsNumber()
    vipRevenue;
    @IsNumber()
    moderationRate;
    @IsOptional()
    @IsNumber()
    newUsersToday;
    @IsOptional()
    @IsNumber()
    newUsersThisWeek;
    @IsOptional()
    @IsNumber()
    vipSubscribers;
    @IsOptional()
    @IsNumber()
    vipConversionRate;
}
export class DashboardAlertDto {
    @IsString()
    id;
    @IsString()
    type;
    @IsString()
    title;
    @IsString()
    message;
    @IsOptional()
    @IsString()
    actionUrl;
    @IsDateString()
    createdAt;
}
//# sourceMappingURL=dashboard.dto.js.map