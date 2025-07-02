import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  console.log('AuthInterceptor: Token found:', !!token, 'for URL:', req.url); // Log pour débogage
  const authReq = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('AuthInterceptor: HTTP error:', error.status, error.message, 'for URL:', req.url); // Log pour débogage
      if (error.status === 401 || error.status === 403) {
        authService.logout();
        alert('Session expirée ou accès non autorisé. Veuillez vous reconnecter.');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};