import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { catchError, Observable, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('/api/Auth/login')) {
    return next(req);
  }

  const authService = inject(AuthService);
  const JWT_TOKEN = authService.getToken();

  const clonedRequest = JWT_TOKEN
    ? req.clone({
        setHeaders: { Authorization: `Bearer ${JWT_TOKEN}` },
      })
    : req;
  return next(clonedRequest).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 || error.status === 403) {
        authService.logout();
      }
      return throwError(() => new Error(error.message || 'Server error'));
    })
  );
};
