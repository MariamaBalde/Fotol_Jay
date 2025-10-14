import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'produits',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/produits/produits-module').then((m) => m.ProduitsModule),
  },
  {
    path: 'profil',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/profil/profil.module').then((m) => m.ProfilModule),
  },
  { path: '', redirectTo: '/produits', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}