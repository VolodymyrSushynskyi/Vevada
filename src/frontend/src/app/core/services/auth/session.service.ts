import { Injectable, signal, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AuthResponse } from '../../models/auth.models';

@Injectable({
  providedIn: 'root',
})
export class SessionService {
  private platformId = inject(PLATFORM_ID);

  currentUserEmail = signal<string | null>(null);
  currentUserRole = signal<string | null>(null);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentUserEmail.set(localStorage.getItem('user_email'));
      this.currentUserRole.set(localStorage.getItem('user_role'));
    }
  }

  startSession(response: AuthResponse): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('access_token', response.accessToken);

      if (response.refreshToken) {
        localStorage.setItem('refresh_token', response.refreshToken);
      }

      localStorage.setItem('user_email', response.email);
      localStorage.setItem('user_role', response.role);
    }

    this.currentUserEmail.set(response.email);
    this.currentUserRole.set(response.role);
  }

  clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('user_email');
      localStorage.removeItem('user_role');
    }

    this.currentUserEmail.set(null);
    this.currentUserRole.set(null);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('access_token');
    }
    return false;
  }
}
