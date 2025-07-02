import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { ProductsService, Product, Page } from '../../auth/services/products.service';
import { SaleService } from '../../auth/services/sale.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-sales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule
  ],
  templateUrl: './product-management.component.html',
  styleUrls: ['./product-management.component.css']
})
export class ProductManagementComponent implements OnInit {
  products: Page<Product> = { content: [], totalElements: 0, totalPages: 0, pageSize: 12, number: 0 };
  filter: string = '';
  categories: string[] = [];
  selectedCategory: string = '';
  isLoading = false;
  page = 0;
  pageSize = 12;

  constructor(private productsService: ProductsService,
    private saleService: SaleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.loadCategories();
  }

  loadProducts(): void {
    this.isLoading = true;
    const filter = this.selectedCategory ? `category:${this.selectedCategory}` : this.filter;
    this.productsService.getAllProducts(this.page, this.pageSize, 'name', filter).subscribe({
      next: (page) => {
        this.products = page;
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  loadCategories(): void {
    this.productsService.getCategories().subscribe({
      next: (categories) => this.categories = categories,
      error: () => {}
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

  addToOrder(product: Product): void {
  if (product.stock < 1) {
      this.snackBar.open('Stock insuffisant', 'Fermer', { duration: 4000 });
      return;
    }
    console.log('Adding product ID:', product.id); // Log pour débogage
    this.saleService.addToOrder(product.id, 1);
    this.snackBar.open(`${product.name} ajouté à la commande`, 'Fermer', { duration: 4000 });
    this.router.navigate(['/admin/products/sales/manage']);
  }
}