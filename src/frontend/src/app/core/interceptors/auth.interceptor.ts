import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, throwError } from 'rxjs';
import { catchError, filter, switchMap, take } from 'rxjs/operators';

import { environment } from '../config/environment';
import { AuthService } from '../services/auth/auth.service';
import { SessionService } from '../services/auth/session.service';

let isRefreshing = false;
let refreshTokenSubject = new BehaviorSubject<any>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);
  const authService = inject(AuthService);
  const sessionService = inject(SessionService);

  const isApiUrl = req.url.startsWith(environment.apiUrl);
  const isRefreshUrl = req.url.includes('/auth/refresh-token');
  const hasAuthHeader = req.headers.has('Authorization');
  const token = isPlatformBrowser(platformId) ? localStorage.getItem('access_token') : null;

  let authReq = req;

  if (token && isApiUrl && !hasAuthHeader && !isRefreshUrl) {
    authReq = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (
        !(error instanceof HttpErrorResponse) ||
        error.status !== 401 ||
        req.url.includes('/auth/refresh-token')
      ) {
        return throwError(() => error);
      }

      if (isRefreshing) {
        return refreshTokenSubject.pipe(
          filter((result) => result !== null),
          take(1),
          switchMap(() => {
            const newToken = isPlatformBrowser(platformId)
              ? localStorage.getItem('access_token')
              : null;
            return next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }));
          }),
        );
      }

      isRefreshing = true;
      refreshTokenSubject.next(null);

      const refreshToken = isPlatformBrowser(platformId)
        ? localStorage.getItem('refresh_token')
        : null;

      if (refreshToken) {
        return authService.refreshToken(refreshToken).pipe(
          switchMap((rawResponse: any) => {
            isRefreshing = false;

            const response = rawResponse;

            sessionService.startSession(response);
            refreshTokenSubject.next(response.accessToken);

            return next(
              req.clone({ setHeaders: { Authorization: `Bearer ${response.accessToken}` } }),
            );
          }),
          catchError((err) => {
            isRefreshing = false;
            sessionService.clearSession();
            router.navigate(['/login']);
            return throwError(() => err);
          }),
        );
      } else {
        isRefreshing = false;
        sessionService.clearSession();
        router.navigate(['/login']);
        return throwError(() => error);
      }
    }),
  );
};
