import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, interval, Subject, Subscription } from 'rxjs';
import { tap, switchMap, startWith, filter } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Notification, ReponseNotifications } from '../models/notification.model';
import { AuthService } from './auth.service';

// Toast UI
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  titre: string;
  message: string;
  duree?: number;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationsService {
  private apiUrl = `${environment.apiUrl}/notifications`;

  // Notifications système
  private nonLuesSubject = new BehaviorSubject<number>(0);
  public nonLues$ = this.nonLuesSubject.asObservable();

  // Toast UI
  private toastSubject = new Subject<Toast>();
  public toast$ = this.toastSubject.asObservable();

  private pollingSubscription?: Subscription;

  constructor(private http: HttpClient, private authService: AuthService) {
    // Ne démarrer le polling que lorsque l'utilisateur se connecte explicitement
    this.authService.utilisateur$.pipe(
      filter(utilisateur => utilisateur !== null)
    ).subscribe(() => {
      this.demarrerPolling();
    });

    // Arrêter le polling lorsque l'utilisateur se déconnecte
    this.authService.utilisateur$.pipe(
      filter(utilisateur => utilisateur === null)
    ).subscribe(() => {
      this.arreterPolling();
    });
  }

  // --- Toast UI ---
  private afficherToast(toast: Omit<Toast, 'id'>): void {
    const toastAvecId: Toast = {
      ...toast,
      id: this.genererId(),
      duree: toast.duree || 5000,
    };
    this.toastSubject.next(toastAvecId);
  }

  success(titre: string, message: string, duree?: number): void {
    this.afficherToast({ type: 'success', titre, message, duree });
  }

  error(titre: string, message: string, duree?: number): void {
    this.afficherToast({ type: 'error', titre, message, duree });
  }

  warning(titre: string, message: string, duree?: number): void {
    this.afficherToast({ type: 'warning', titre, message, duree });
  }

  info(titre: string, message: string, duree?: number): void {
    this.afficherToast({ type: 'info', titre, message, duree });
  }

  private genererId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // --- Notifications système ---
  obtenirNotifications(options: {
    seulement_non_lues?: boolean;
    page?: number;
    limite?: number;
  } = {}): Observable<ReponseNotifications> {
    let params = new HttpParams();

    if (options.seulement_non_lues) {
      params = params.set('seulement_non_lues', 'true');
    }
    if (options.page) {
      params = params.set('page', options.page.toString());
    }
    if (options.limite) {
      params = params.set('limite', options.limite.toString());
    }

    return this.http.get<ReponseNotifications>(this.apiUrl, { params }).pipe(
      tap((reponse) => {
        this.nonLuesSubject.next(reponse.nonLues);
      })
    );
  }

  compterNonLues(): Observable<{ nonLues: number }> {
    return this.http.get<{ nonLues: number }>(`${this.apiUrl}/non-lues/count`).pipe(
      tap((reponse) => {
        this.nonLuesSubject.next(reponse.nonLues);
      })
    );
  }

  marquerCommeLue(id: string): Observable<any> {
    return this.http.patch(`${this.apiUrl}/${id}/lue`, {}).pipe(
      tap(() => {
        const current = this.nonLuesSubject.value;
        this.nonLuesSubject.next(Math.max(0, current - 1));
      })
    );
  }

  marquerToutesCommeLues(): Observable<any> {
    return this.http.patch(`${this.apiUrl}/toutes/lues`, {}).pipe(
      tap(() => {
        this.nonLuesSubject.next(0);
      })
    );
  }

  supprimerNotification(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private demarrerPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
    this.pollingSubscription = interval(30000)
      .pipe(
        startWith(0),
        switchMap(() => this.compterNonLues())
      )
      .subscribe();
  }

  private arreterPolling(): void {
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
      this.pollingSubscription = undefined;
    }
  }

  obtenirNombreNonLues(): number {
    return this.nonLuesSubject.value;
  }

  formaterDateRelative(date: Date): string {
    const maintenant = new Date();
    const dateNotif = new Date(date);
    const diff = maintenant.getTime() - dateNotif.getTime();

    const minutes = Math.floor(diff / (1000 * 60));
    const heures = Math.floor(diff / (1000 * 60 * 60));
    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'À l\'instant';
    if (minutes < 60) return `Il y a ${minutes} min`;
    if (heures < 24) return `Il y a ${heures}h`;
    if (jours < 7) return `Il y a ${jours} jour${jours > 1 ? 's' : ''}`;

    return dateNotif.toLocaleDateString('fr-FR');
  }

  obtenirIcone(type: string): string {
    const icones: { [key: string]: string } = {
      EXPIRATION_J2: '⏰',
      EXPIRATION_J0: '⚠️',
      PRODUIT_EXPIRE: '❌',
      PRODUIT_APPROUVE: '✅',
      PRODUIT_REFUSE: '🚫',
      CONTACT_RECU: '📞',
      NOUVEAU_MESSAGE: '💬',
      VIP_EXPIRE: '⭐',
      VIP_BIENTOT_EXPIRE: '⭐',
    };

    return icones[type] || '🔔';
  }

  obtenirCouleur(type: string): string {
    const couleurs: { [key: string]: string } = {
      EXPIRATION_J2: 'warning',
      EXPIRATION_J0: 'danger',
      PRODUIT_EXPIRE: 'danger',
      PRODUIT_APPROUVE: 'success',
      PRODUIT_REFUSE: 'danger',
      CONTACT_RECU: 'info',
      NOUVEAU_MESSAGE: 'primary',
      VIP_EXPIRE: 'warning',
      VIP_BIENTOT_EXPIRE: 'warning',
    };

    return couleurs[type] || 'secondary';
  }
}