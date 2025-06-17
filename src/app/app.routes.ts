import { Routes } from '@angular/router';
import { authGuard } from './core/auth/guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./core/component/auth/auth.component').then(m => m.AuthComponent)
  },
  {
    path: 'admin',
    loadComponent: () => import('./core/component/admin-layout/admin-layout.component').then(m => m.AdminLayoutComponent),
    canActivate: [authGuard],
    data: { roles: ['ADMIN'] },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./core/component/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'pharmacists',
        loadComponent: () => import('./core/component/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
      },
      {
        path: 'new',
        loadComponent: () => import('./core/component/admin-management-form/admin-management-form.component').then(m=> m.PharmacistFormComponent)
      },
      {
        path: 'pharmacist/:id',
        loadComponent: () => import('./core/component/admin-management-form/admin-management-form.component').then(m=> m.PharmacistFormComponent)

      }
     
     
    ]
  },
  {
    path: 'pharmacist-dashboard',
    loadComponent: () => import('./core/component/pharmacist-dashboard/pharmacist-dashboard.component').then(m => m.PharmacistDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['PHARMACIST'] }
  }
];