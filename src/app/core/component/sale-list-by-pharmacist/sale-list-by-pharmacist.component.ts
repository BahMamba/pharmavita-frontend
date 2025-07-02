import { Component, OnInit } from '@angular/core';
import { Page, Sale, SaleService } from '../../auth/services/sale.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-sale-list-by-pharmacist',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatToolbarModule,
    MatSnackBarModule
  ],
  templateUrl: './sale-list-by-pharmacist.component.html',
  styleUrls: ['./sale-list-by-pharmacist.component.css']
})
export class SaleListByPharmacistComponent implements OnInit {
  sales: Page<Sale> = { content: [], totalElements: 0, totalPages: 0, number: 0, size: 10 };
  isLoading = false;
  page = 0;
  pageSize = 5;
  sortBy = 'saleDate';

  constructor(
    private saleService: SaleService,
    private snackBar: MatSnackBar  
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading = true;
    this.saleService.getMySales(this.page, this.pageSize, this.sortBy).subscribe({
      next: (data) => {
        this.sales = data;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erreur chargement ventes', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  handlePageEvent(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadSales();
  }
}