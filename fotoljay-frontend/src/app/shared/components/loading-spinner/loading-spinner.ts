import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="'spinner-container ' + (pleinEcran ? 'plein-ecran' : '')"
         [style.--spinner-color]="couleur">
      <div [class]="'spinner spinner-' + type + ' taille-' + taille">
        <div *ngIf="type === 'circular'" class="circular"></div>
        <div *ngIf="type === 'dots'" class="dots">
          <div></div><div></div><div></div>
        </div>
        <div *ngIf="type === 'bars'" class="bars">
          <div></div><div></div><div></div>
        </div>
        <div *ngIf="type === 'pulse'" class="pulse"></div>
      </div>
      <p *ngIf="afficherMessage" class="message">{{message}}</p>
    </div>
  `,
  styles: [`
    .spinner-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      --spinner-color: #667eea;
    }
    
    .plein-ecran {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 9999;
    }

    .spinner {
      margin: 1rem;
    }

    .message {
      color: #4a5568;
      margin-top: 0.5rem;
    }

    /* Tailles */
    .taille-small { font-size: 1rem; }
    .taille-medium { font-size: 1.5rem; }
    .taille-large { font-size: 2rem; }

    /* Types */
    .spinner-circular {
      border: 3px solid transparent;
      border-top-color: var(--spinner-color);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .spinner-dots .dots {
      display: flex;
      gap: 0.5rem;
    }

    .spinner-bars .bars {
      display: flex;
      gap: 0.25rem;
    }

    .spinner-pulse {
      width: 1em;
      height: 1em;
      background: var(--spinner-color);
      border-radius: 50%;
      animation: pulse 1s ease-in-out infinite;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    @keyframes pulse {
      0% { transform: scale(0.8); opacity: 0.5; }
      100% { transform: scale(1.2); opacity: 0; }
    }
  `]
})
export class LoadingSpinnerComponent {
  @Input() taille: 'small' | 'medium' | 'large' = 'medium';
  @Input() couleur: string = '#667eea';
  @Input() message: string = 'Chargement...';
  @Input() afficherMessage: boolean = true;
  @Input() pleinEcran: boolean = false;
  @Input() type: 'circular' | 'dots' | 'bars' | 'pulse' = 'circular';
}