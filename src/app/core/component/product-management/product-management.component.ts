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
import { RouterModule } from '@angular/router';
import { ProductsService, Product, Page } from '../../auth/services/products.service';

@Component({
  selector: 'app-product-sales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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

  constructor(private productsService: ProductsService) {}

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
    console.log(`Produit ${product.name} ajouté à la commande`);
  }
}