import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  constructor(private http: HttpClient) {}

  success(title: string, message: string): void {
    // Implémentation...
  }

  warning(title: string, message: string): void {
    // Implémentation...
  }

  error(title: string, message: string): void {
    // Implémentation...
  }
}