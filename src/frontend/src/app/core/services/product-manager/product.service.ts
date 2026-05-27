import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AdminProductListResponse,
  CreateProductCommand,
  UpdateProductCommand,
  ProductStatus,
} from '../../models/base/product.models';
import { environment } from '../../config/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productsUrl = `${environment.apiUrl}/api/admin/products`;
  private imagesUrl = `${environment.apiUrl}/api/admin/images`;

  constructor(private http: HttpClient) {}

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<string>(this.imagesUrl, formData);
  }

  getProducts(
    page: number = 1,
    pageSize: number = 6,
    status?: ProductStatus,
  ): Observable<AdminProductListResponse> {
    let params = new HttpParams().set('page', page.toString()).set('pageSize', pageSize.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<AdminProductListResponse>(this.productsUrl, { params });
  }

  createProduct(command: CreateProductCommand): Observable<string> {
    return this.http.post<string>(this.productsUrl, command);
  }

  updateProduct(id: string, command: UpdateProductCommand): Observable<boolean> {
    return this.http.put<boolean>(`${this.productsUrl}/${id}`, command);
  }

  deleteProduct(id: string): Observable<boolean> {
    return this.http.delete<boolean>(`${this.productsUrl}/${id}`);
  }
}
