import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CatalogProductDto } from '../../models/catalog-product.models';
import { PagedResponse } from '../../models/common.models';
import { environment } from '../../config/environment';

@Injectable({
  providedIn: 'root',
})
export class CatalogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/catalog`;

  getCatalog(page: number = 1, pageSize: number = 9): Observable<PagedResponse<CatalogProductDto>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedResponse<CatalogProductDto>>(this.apiUrl, { params });
  }
}
