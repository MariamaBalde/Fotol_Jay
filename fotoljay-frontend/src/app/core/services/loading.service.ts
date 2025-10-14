import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$: Observable<boolean> = this.loadingSubject.asObservable();

  private compteurRequetes = 0;

  afficher(): void {
    this.compteurRequetes++;
    this.loadingSubject.next(true);
  }

  masquer(): void {
    this.compteurRequetes--;
    if (this.compteurRequetes <= 0) {
      this.compteurRequetes = 0;
      this.loadingSubject.next(false);
    }
  }

  reset(): void {
    this.compteurRequetes = 0;
    this.loadingSubject.next(false);
  }
}