import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoriteItemDto } from '../../models/favorite-item.models';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private readonly apiUrl = '/api/favorites';

  getFavorites(): Observable<FavoriteItemDto[]> {
    return this.http.get<FavoriteItemDto[]>(this.apiUrl);
  }

  toggleFavorite(productId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/toggle/${productId}`, {});
  }
}
