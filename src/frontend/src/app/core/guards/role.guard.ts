import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/auth/session.service';
import { ToastService } from '../services/common/toast.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const sessionService = inject(SessionService);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const toastService = inject(ToastService);

  if (!isPlatformBrowser(platformId)) {
    return true;
  }

  if (!sessionService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  const currentRole = sessionService.currentUserRole();

  if (currentRole === 'SuperAdmin') {
    return true;
  }

  const allowedRoles = route.data['roles'] as Array<string>;

  if (!allowedRoles || !currentRole || !allowedRoles.includes(currentRole)) {
    toastService.showError('У вас немає прав для перегляду цієї сторінки');
    router.navigate(['/']);
    return false;
  }

  return true;
};
