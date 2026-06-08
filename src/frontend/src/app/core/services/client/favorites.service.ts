import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../config/environment';
import { FavoriteItemDto } from '../../models/favorite-item.models';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/favorites`;

  getFavorites(): Observable<FavoriteItemDto[]> {
    return this.http.get<FavoriteItemDto[]>(this.apiUrl);
  }

  toggleFavorite(productId: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/toggle/${productId}`, {});
  }
}
