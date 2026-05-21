import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../config/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const platformId = inject(PLATFORM_ID);

  const isApiUrl = req.url.startsWith(environment.apiUrl);

  const hasAuthHeader = req.headers.has('Authorization');
  const token = isPlatformBrowser(platformId) ? localStorage.getItem('access_token') : null;

  if (token && isApiUrl && !hasAuthHeader) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};
