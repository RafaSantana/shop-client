import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product';
import { PaginatedResponse } from '../models/paginated-response';
import { SearchProducts } from '../models/search-products';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = 'http://localhost:3000';

  constructor(private readonly http: HttpClient) {}

  /**
   * Busca todos os produtos (para filtragem no cliente)
   * Endpoint: GET /products
   */
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/products`);
  }

  /**
   * Busca produtos com paginação e filtros (para filtragem no servidor)
   * Endpoint: GET /products/search
   */
  searchProducts(params: SearchProducts = {}): Observable<PaginatedResponse<Product>> {
    let httpParams = new HttpParams();

    if (params.search) {
      httpParams = httpParams.set('search', params.search);
    }
    if (params.page !== undefined) {
      httpParams = httpParams.set('page', params.page.toString());
    }
    if (params.limit !== undefined) {
      httpParams = httpParams.set('limit', params.limit.toString());
    }

    return this.http.get<PaginatedResponse<Product>>(`${this.apiUrl}/products/search`, {
      params: httpParams,
    });
  }

  /**
   * Busca um produto específico por ID
   * Endpoint: GET /products/:id
   */
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/products/${id}`);
  }
}
