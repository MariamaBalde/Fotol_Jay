import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListeProduitsComponent } from './liste-produits/liste-produits.component';
import { DetailProduitComponent } from './detail-produit/detail-produit.component';
import { CreerProduitComponent } from './creer-produit/creer-produit.component';
import { MesProduitsComponent } from './mes-produits/mes-produits';
import { AuthGuard } from '../../core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: ListeProduitsComponent },
  { path: 'creer', component: CreerProduitComponent, canActivate: [AuthGuard] },
  { path: 'mes-produits', component: MesProduitsComponent, canActivate: [AuthGuard] },
  { path: ':id', component: DetailProduitComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduitsRoutingModule {}