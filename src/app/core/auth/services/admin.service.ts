import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

export interface User {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'PHARMACIST';
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) {}

  getAllPharmacists(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl).pipe(
      catchError(error => throwError(() => new Error('Erreur lors de la récupération des pharmaciens')))
    );
  }

  getPharmacistById(id: number): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => throwError(() => new Error('Erreur lors de la récupération du pharmacien')))
    );
  }

  createPharmacist(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.baseUrl, user).pipe(
      catchError(error => throwError(() => new Error('Erreur lors de la création du pharmacien')))
    );
  }

  updatePharmacist(id: number, user: Partial<User>): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${id}`, user).pipe(
      catchError(error => throwError(() => new Error('Erreur lors de la mise à jour du pharmacien')))
    );
  }

  deletePharmacist(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`).pipe(
      catchError(error => throwError(() => new Error('Erreur lors de la suppression du pharmacien')))
    );
  }
}