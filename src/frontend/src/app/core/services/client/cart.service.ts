import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../config/environment';
import { CartDto, CartItemDto, AddCartItemDto } from '../../models/cart.models';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/cart`;

  getCart(): Observable<CartDto> {
    return this.http.get<CartDto>(this.apiUrl);
  }

  addItem(item: AddCartItemDto): Observable<void> {
    return this.http.post<void>(this.apiUrl, item);
  }

  updateQuantity(cartItemId: number, quantity: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${cartItemId}`, { quantity });
  }

  removeItem(cartItemId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${cartItemId}`);
  }
}
