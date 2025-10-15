import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  {
    path: '',
    canActivate: [AdminGuard],
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'moderation',
        loadComponent: () => import('./moderation/moderation.component').then(m => m.ModerationComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./users/users').then(m => m.UsersComponent)
      },
      {
        path: 'reports',
        loadComponent: () => import('./reports/reports').then(m => m.ReportsComponent)
      },
      {
        path: 'moderators',
        loadComponent: () => import('./moderators/moderators').then(m => m.ModeratorsComponent)
      },
      {
        path: 'vip-settings',
        loadComponent: () => import('./vip-settings/vip-settings').then(m => m.VipSettingsComponent)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }