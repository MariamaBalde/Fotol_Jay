import { Routes } from '@angular/router';
import { ConnexionComponent } from './features/auth/connexion/connexion.component';
import { InscriptionComponent } from './features/auth/inscription/inscription.component';
import { AccueilComponent } from './features/accueil/accueil.component';

export const routes: Routes = [
  {
    path: '',
    component: AccueilComponent,
  },
  {
    path: 'auth/login',
    component: ConnexionComponent,
  },
  {
    path: 'auth/register',
    component: InscriptionComponent,
  },
  {
    path: 'produits',
    loadChildren: () => import('./features/produits/produits.module').then(m => m.ProduitsModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule)
  }
];
