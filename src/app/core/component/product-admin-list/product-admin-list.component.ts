import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ProductsService, Product, Page } from '../../../core/auth/services/products.service';

@Component({
  selector: 'app-product-admin-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule, // Ajout pour le menu déroulant
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-admin-list.component.html',
  styleUrls: ['./product-admin-list.component.css']
})
export class ProductAdminListComponent implements OnInit {
  displayedColumns: string[] = ['name', 'category', 'price', 'stock', 'status', 'expirationDate', 'actions'];
  products: Page<Product> = { content: [], totalElements: 0, totalPages: 0, pageSize: 10, number: 0 };
  filter: string = '';
  statusFilter: string = ''; // Filtre par statut
  statusOptions = [
    { value: '', label: 'Tous' },
    { value: 'LOW_STOCK', label: 'Stock faible' },
    { value: 'IN_STOCK', label: 'En stock' },
    { value: 'OUT_OF_STOCK', label: 'Rupture' }
  ];
  isLoading = false;
  page = 0;
  pageSize = 10;

  constructor(
    private productsService: ProductsService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;
    // Combine statut et filtre texte
    const combinedFilter = this.statusFilter ? `status:${this.statusFilter}` : this.filter;
    this.productsService.getProductsForRestock(this.page, this.pageSize, 'stock', combinedFilter).subscribe({
      next: (page) => {
        this.products = page;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  applyFilter(): void {
    this.page = 0;
    this.loadProducts();
  }

  handlePageEvent(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  deleteProduct(id: number): void {
    this.productsService.deleteProduct(id).subscribe({
      next: () => {
        this.snackBar.open('Produit supprimé', 'Fermer', { duration: 4000 });
        this.loadProducts();
      },
      error: () => this.snackBar.open('Erreur lors de la suppression', 'Fermer', { duration: 4000 })
    });
  }
}