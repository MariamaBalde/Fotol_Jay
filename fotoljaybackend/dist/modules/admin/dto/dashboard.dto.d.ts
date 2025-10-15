export declare class DashboardStatsDto {
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    pendingProducts: number;
    approvedProducts: number;
    vipRevenue: number;
    moderationRate: number;
    newUsersToday?: number;
    newUsersThisWeek?: number;
    vipSubscribers?: number;
    vipConversionRate?: number;
}
export declare class DashboardAlertDto {
    id: string;
    type: 'warning' | 'error' | 'info';
    title: string;
    message: string;
    actionUrl?: string;
    createdAt: Date;
}
//# sourceMappingURL=dashboard.dto.d.ts.map