import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginRequest, RegisterRequest, AuthResponse } from '../../models/base/auth.models';
import { environment } from '../../config/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private readonly API_URL = `${environment.apiUrl}/auth`;

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials);
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData);
  }

  loginAdmin(credentials: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/admin/login`, credentials);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.API_URL}/logout`, {});
  }

  refreshToken(refreshToken: string) {
    const accessToken = localStorage.getItem('access_token');

    return this.http.post<AuthResponse>(`${this.API_URL}/refresh`, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  }

  checkAuthStatus(): Observable<string> {
    return this.http.get(this.API_URL, { responseType: 'text' });
  }
}
