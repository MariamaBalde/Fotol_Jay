import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface DashboardStats {
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
  conversionRate?: number;
  pendingReports?: number;
  recentErrors?: number;
  avgResponseTime?: number;
  uptime?: number;
  alerts?: DashboardAlert[];
}

export interface DashboardAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  message: string;
  actionUrl?: string;
  createdAt: Date;
}

export interface UserFilters {
  search?: string;
  role?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface UserDto {
  id: string;
  nom: string;
  email: string;
  telephone: string;
  role: string;
  status: string;
  productsCount?: number;
  lastLogin?: string;
  createdAt?: string;
}

export interface UsersResponse {
  users: UserDto[];
  total: number;
  page: number;
  limit: number;
}

export interface UpdateUserStatusDto {
  status: string;
}

export interface PendingProductDto {
  id: string;
  titre: string;
  description: string;
  images: string[];
  categorie: string;
  etat: string;
  prix: number;
  vendeurNom: string;
  vendeurTelephone: string;
  vendeurEmail: string;
  dateCreation: string;
  vues?: number;
}

export interface ModerationDecisionDto {
  decision: 'APPROUVER' | 'REFUSER' | 'ATTENTE';
  commentaire?: string;
}

export interface ModerationResultDto {
  message: string;
  status: string;
  commentaire?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/dashboard`);
  }

  // Gestion utilisateurs
  getUsers(filters: UserFilters = {}): Observable<UsersResponse> {
    let params = new HttpParams();

    if (filters.search) params = params.set('search', filters.search);
    if (filters.role) params = params.set('role', filters.role);
    if (filters.status) params = params.set('status', filters.status);
    if (filters.page) params = params.set('page', filters.page.toString());
    if (filters.limit) params = params.set('limit', filters.limit.toString());

    return this.http.get<UsersResponse>(`${this.apiUrl}/users`, { params });
  }

  updateUserStatus(userId: string, data: UpdateUserStatusDto): Observable<UserDto> {
    return this.http.patch<UserDto>(`${this.apiUrl}/users/${userId}/status`, data);
  }

  // Modération
  getPendingProducts(): Observable<PendingProductDto[]> {
    return this.http.get<PendingProductDto[]>(`${this.apiUrl}/moderation/pending`);
  }

  moderateProduct(productId: string, decision: ModerationDecisionDto): Observable<ModerationResultDto> {
    return this.http.post<ModerationResultDto>(`${this.apiUrl}/moderation/${productId}`, decision);
  }

  // Signalements
  getReports(status?: string): Observable<any> {
    let params = new HttpParams();
    if (status) {
      params = params.set('status', status);
    }
    return this.http.get(`${this.apiUrl}/reports`, { params });
  }

  processReport(reportId: string, action: string, commentaire?: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/reports/${reportId}`, { action, commentaire });
  }

  // Modérateurs
  getModerators(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/moderators`);
  }

  createModerator(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/moderators`, data);
  }

  updateUserRole(userId: string, role: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  updateModeratorStatus(userId: string, statut: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/moderators/${userId}/status`, { statut });
  }

  updateModerator(userId: string, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/moderators/${userId}`, data);
  }

  deleteModerator(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/moderators/${userId}`);
  }

  getModeratorHistory(moderatorId: string, page?: number, limit?: number): Observable<any> {
    let params = new HttpParams();
    if (page) params = params.set('page', page.toString());
    if (limit) params = params.set('limit', limit.toString());
    return this.http.get(`${this.apiUrl}/moderators/${moderatorId}/history`, { params });
  }

  getModeratorRanking(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/moderators/ranking`);
  }

  submitModeratorFeedback(moderatorId: string, feedback: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/moderators/${moderatorId}/feedback`, feedback);
  }

  // Paramètres VIP
  getVipSettings(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/vip-settings`);
  }

  updateVipSetting(key: string, valeur: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/vip-settings/${key}`, { valeur });
  }

  // Export
  exportReport(type: string, format?: string): Observable<any> {
    let params = new HttpParams();
    if (format) {
      params = params.set('format', format);
    }
    return this.http.get(`${this.apiUrl}/export/${type}`, { params });
  }
}