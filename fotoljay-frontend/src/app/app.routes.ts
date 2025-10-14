import { Routes } from '@angular/router';
import { ConnexionComponent } from './features/auth/connexion/connexion.component';
import { InscriptionComponent } from './features/auth/inscription/inscription.component';
import { ListeProduitsComponent } from './features/produits/liste-produits/liste-produits.component';

export const routes: Routes = [
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
  { path: '', redirectTo: '/produits', pathMatch: 'full' }
];
