import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  manufacturingDate: string;
  expirationDate: string;
}

export interface AuditLog {
  id: number;
  entityId: number;
  entityType: string;
  actionType: string;
  details: string;
  performedBy: string;
  timestamp: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  pageSize: number;
  number: number;
}

export interface StockUpdateRequest {
  stockChange: number;
  reason: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private http: HttpClient) {}

  getAllProducts(page: number, size: number, sortBy: string = 'name', filter?: string): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    if (filter) {
      params = params.set('filter', filter);
    }
    return this.http.get<Page<Product>>(this.baseUrl, { params }).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la récupération des produits')))
    );
  }

  getProductsForRestock(page: number, size: number, sortBy: string = 'stock', filter?: string): Observable<Page<Product>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);
    if (filter) {
      params = params.set('filter', filter);
    }
    return this.http.get<Page<Product>>(`${this.baseUrl}/restock`, { params }).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la récupération des produits à réapprovisionner')))
    );
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la récupération du produit')))
    );
  }

  addProduct(product: Partial<Product>): Observable<Product> {
    return this.http.post<Product>(this.baseUrl, product).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de l\'ajout du produit')))
    );
  }

  updateProduct(id: number, product: Partial<Product>): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${id}`, product).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la mise à jour du produit')))
    );
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la suppression du produit')))
    );
  }

  updateStock(id: number, request: StockUpdateRequest): Observable<Product> {
    return this.http.patch<Product>(`${this.baseUrl}/${id}/stock`, request).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la mise à jour du stock')))
    );
  }

  getRestockHistory(id: number): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.baseUrl}/${id}/restock-history`).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la récupération de l\'historique de réapprovisionnement')))
    );
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.baseUrl}/categories`).pipe(
      catchError(() => throwError(() => new Error('Erreur lors de la récupération des catégories')))
    );
  }
}