import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../config/environment';
import { ProductReviewDto, LeaveReviewDto } from '../../models/product-reviews.models';
import { PagedResponse } from '../../models/common.models';

@Injectable({
  providedIn: 'root',
})
export class ProductRewiewsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/products`;

  getReviews(
    productId: string,
    page: number = 1,
    pageSize: number = 10,
  ): Observable<PagedResponse<ProductReviewDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<ProductReviewDto>>(`${this.apiUrl}/${productId}/reviews`, {
      params,
    });
  }

  leaveReview(productId: string, payload: LeaveReviewDto): Observable<number> {
    return this.http.put<number>(`${this.apiUrl}/${productId}/reviews`, payload);
  }

  deleteReview(productId: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.apiUrl}/${productId}/reviews`);
  }
}
