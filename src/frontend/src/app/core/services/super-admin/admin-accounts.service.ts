import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminAccountListResponse,
  CreateAdminAccountCommand,
} from '../../models/admin-accounts.models';
import { environment } from '../../config/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminAccountsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/admin/accounts`;

  getAccounts(
    page: number = 1,
    pageSize: number = 6,
    role?: string,
  ): Observable<AdminAccountListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());

    if (role && role !== 'all') {
      params = params.set('role', role);
    }

    return this.http.get<AdminAccountListResponse>(this.apiUrl, { params });
  }

  createAccount(command: CreateAdminAccountCommand): Observable<number> {
    return this.http.post<number>(this.apiUrl, command);
  }

  deleteAccount(id: number): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${id}`);
  }
}
