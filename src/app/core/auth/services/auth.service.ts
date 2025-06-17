import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';

export interface UserProfile {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  role: 'ADMIN' | 'PHARMACIST';
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'http://localhost:8080/api/auth';
  private TOKEN_KEY = 'auth_token';
  private PROFILE_KEY = 'user_profile';

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { email: string; password: string }): Observable<UserProfile> {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
    
    return this.http.post<{ token: string }>(`${this.baseUrl}/login`, credentials).pipe(
      tap(res => localStorage.setItem(this.TOKEN_KEY, res.token)),
      switchMap(() => this.getProfile()),
      tap(profile => {
        localStorage.setItem(this.PROFILE_KEY, JSON.stringify(profile));
        this.redirectBasedOnRole(profile.role);
      }),
      catchError(error => throwError(() => error))
    );
  }

  getProfile(): Observable<UserProfile> {
    const token = this.getToken();
    if (!token) {
      return throwError(() => new Error('Non authentifié'));
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<UserProfile>(`${this.baseUrl}/profile`, { headers });
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.PROFILE_KEY);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getProfileFromStorage(): UserProfile | null {
    const profile = localStorage.getItem(this.PROFILE_KEY);
    return profile ? JSON.parse(profile) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  private redirectBasedOnRole(role: 'ADMIN' | 'PHARMACIST'): void {
    const route = role === 'ADMIN' ? '/admin-dashboard' : '/pharmacist-dashboard';
    this.router.navigate([route]);
  }
}