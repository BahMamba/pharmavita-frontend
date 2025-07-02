import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}


export interface SaleItemRequest {
  productId: number;
  quantity: number;
}

export interface Sale {
  id: number;
  performedBy: string;
  saleDate: string;
  saleAmount: number;
  items: SaleItem[];
}

export interface SaleItem {
  id: number;
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    category: string;
    status: string;
    manufacturingDate: string;
    expirationDate: string;
  };
  quantity: number;
  unitPrice: number;
}

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private baseUrl = 'http://localhost:8080/api/sales';
  private order: SaleItemRequest[] = [];

  constructor(private http: HttpClient) {}

  addToOrder(productId: number, quantity: number): void {
    const existingItem = this.order.find(item => item.productId === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.order.push({ productId, quantity });
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    const item = this.order.find(item => item.productId === productId);
    if (item) {
      if (quantity <= 0) {
        this.removeFromOrder(productId);
      } else {
        item.quantity = quantity;
      }
    }
  }

  removeFromOrder(productId: number): void {
    this.order = this.order.filter(item => item.productId !== productId);
  }

  getOrder(): SaleItemRequest[] {
    return this.order;
  }

  clearOrder(): void {
    this.order = [];
  }

  createDraftSale(): Observable<Sale> {
    const request = { items: this.order };
    return this.http.post<Sale>(`${this.baseUrl}/draft`, request).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la création du brouillon')))
    );
  }

  createSale(): Observable<Sale> {
    const request = { items: this.order };
    return this.http.post<Sale>(this.baseUrl, request).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la création de la vente')))
    );
  }

  getReceipt(saleId: number): Observable<Blob> {
    return this.http.get(`${this.baseUrl}/${saleId}/receipt`, { responseType: 'blob' }).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la génération du reçu')))
    );
  }


  getMySales(page: number = 0, size: number = 10, sortBy: string = 'saleDate'): Observable<Page<Sale>>{
    const params = new HttpParams()
        .set('page', page.toString())
        .set('size', size.toString())
        .set('sortBy', sortBy.toString())
    return this.http.get<Page<Sale>>(`${this.baseUrl}/my-sales`, {params}).pipe(
            catchError(() => throwError(() => new Error('Erreur lors de la récupération des ventes')))
    );
  }
}