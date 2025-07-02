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
        path: 'pharmacist/create',
        loadComponent: () => import('./core/component/admin-management-form/admin-management-form.component').then(m=> m.PharmacistFormComponent)
      },
      {
        path: 'pharmacist/:id',
        loadComponent: () => import('./core/component/admin-management-form/admin-management-form.component').then(m=> m.PharmacistFormComponent)

      },

      {
        path: 'products/sales',
        loadComponent: () => import('./core/component/product-management/product-management.component').then(m=> m.ProductManagementComponent)
      },

      {
        path: 'products/stock-list',
        loadComponent: () => import('./core/component/product-admin-list/product-admin-list.component').then(m => m.ProductAdminListComponent)
      },

      {
        path: 'products/create',
        loadComponent: () => import('./core/component/product-admin-form/product-admin-form.component').then(m => m.ProductAdminFormComponent)
      },

      {
        path: 'products/restock/:id',
        loadComponent: () => import('./core/component/product-restock-form/product-restock-form.component').then(m => m.ProductRestockFormComponent)
      },

      {
        path: 'products/edit/:id',
        loadComponent: () => import('./core/component/product-admin-form/product-admin-form.component').then(m => m.ProductAdminFormComponent)
      },

      {
        path: 'products/sales/manage',
        loadComponent: () => import('./core/component/product-sale/product-sale.component').then(m => m.ProductSaleComponent)
      },

      {
        path: 'products/sales/by-pharma',
        loadComponent: () => import('./core/component/sale-list-by-pharmacist/sale-list-by-pharmacist.component').then(m => m.SaleListByPharmacistComponent)
      }

    ]
  },
  {
    path: 'pharmacist-dashboard',
    loadComponent: () => import('./core/component/pharmacist-dashboard/pharmacist-dashboard.component').then(m => m.PharmacistDashboardComponent),
    canActivate: [authGuard],
    data: { roles: ['PHARMACIST'] }
  },

];