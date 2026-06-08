import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../config/environment';
import { OrderDto } from '../../models/order.models';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/orders`;

  placeOrder(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/checkout`, {});
  }

  getActiveOrders(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/active`);
  }

  getOrderHistory(): Observable<OrderDto[]> {
    return this.http.get<OrderDto[]>(`${this.apiUrl}/history`);
  }

  requestCancellation(orderId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${orderId}/request-cancellation`, {});
  }
}
