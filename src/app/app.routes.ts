import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./core/component/auth/auth.component').then(m => m.AuthComponent),
  },
  {
    path: 'pharmacist-dashboard',
    loadComponent: () =>
      import('./core/component/pharmacist-dashboard/pharmacist-dashboard.component').then(m => m.PharmacistDashboardComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin-dashboard',
    loadComponent: () =>
      import('./core/component/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [authGuard]
  },
];