import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router, RouterModule } from '@angular/router';
import { Sale, SaleItem, SaleItemRequest, SaleService } from '../../auth/services/sale.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'app-product-sale',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    RouterModule
  ],
  templateUrl: './product-sale.component.html',
  styleUrl: './product-sale.component.css'
})
export class ProductSaleComponent implements OnInit {
  orderItems: SaleItem[] = [];
  orderTotal: number = 0;
  isLoading = false;

  constructor(
    private saleService: SaleService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    const localOrder = this.saleService.getOrder();
    if (localOrder.length > 0) {
      this.isLoading = true;
      this.saleService.createDraftSale().subscribe({
        next: (sale) => {
          this.orderItems = sale.items;
          this.orderTotal = sale.saleAmount;
          this.isLoading = false;
          if (this.orderItems.length === 0) {
            this.snackBar.open('Aucun produit valide dans la commande', 'Fermer', { duration: 3000 });
            this.saleService.clearOrder();
          }
        },
        error: () => {
          this.snackBar.open('Erreur chargement commande', 'Fermer', { duration: 3000 });
          this.isLoading = false;
          this.orderItems = [];
          this.saleService.clearOrder();
        }
      });
    }
  }

  increaseQuantity(productId: number, currentQuantity: number, stock: number): void {
    if (currentQuantity < stock) {
      this.saleService.updateQuantity(productId, currentQuantity + 1);
      this.refreshOrder();
    } else {
      this.snackBar.open('Stock insuffisant', 'Fermer', { duration: 3000 });
    }
  }

  decreaseQuantity(productId: number, currentQuantity: number): void {
    this.saleService.updateQuantity(productId, currentQuantity - 1);
    this.refreshOrder();
  }

  removeItem(productId: number): void {
    this.saleService.removeFromOrder(productId);
    this.refreshOrder();
    this.snackBar.open('Produit retiré', 'Fermer', { duration: 3000 });
  }

  createSale(): void {
    if (this.orderItems.length === 0) {
      this.snackBar.open('Aucun produit dans la commande', 'Fermer', { duration: 3000 });
      return;
    }
    this.isLoading = true;
    this.saleService.createSale().subscribe({
      next: (sale) => {
        this.saleService.clearOrder();
        this.orderItems = [];
        this.orderTotal = 0;
        this.snackBar.open('Vente créée', 'Fermer', { duration: 3000 });
        this.downloadReceipt(sale.id);
      },
      error: () => {
        this.snackBar.open('Erreur création vente', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  downloadReceipt(saleId: number): void {
    this.saleService.getReceipt(saleId).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `receipt-${saleId}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
        this.router.navigate(['/admin/products/sales']);
      },
      error: () => {
        this.snackBar.open('Erreur génération reçu', 'Fermer', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  private refreshOrder(): void {
    this.isLoading = true;
    const localOrder = this.saleService.getOrder();
    if (localOrder.length === 0) {
      this.orderItems = [];
      this.orderTotal = 0;
      this.isLoading = false;
      return;
    }
    this.saleService.createDraftSale().subscribe({
      next: (sale) => {
        this.orderItems = sale.items;
        this.orderTotal = sale.saleAmount;
        this.isLoading = false;
      },
      error: () => {
        this.snackBar.open('Erreur chargement commande', 'Fermer', { duration: 3000 });
        this.isLoading = false;
        this.orderItems = [];
        this.saleService.clearOrder();
      }
    });
  }
}