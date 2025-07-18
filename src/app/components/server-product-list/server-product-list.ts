import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ProductService } from '../../services/product';
import { ShoppingCartService } from '../../services/shopping-cart';
import { Product } from '../../models/product';
import { PaginatedResponse } from '../../models/paginated-response';
import { ProductListComponent } from '../product-list/product-list';
import { ProductListData } from '../../models/product-list-data';

@Component({
  selector: 'app-server-product-list',
  imports: [ProductListComponent],
  templateUrl: './server-product-list.html',
})
export class ServerProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(ShoppingCartService);
  private readonly router = inject(Router);

  private readonly responseSignal = signal<PaginatedResponse<Product> | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly itemsPerPage = 10;

  readonly listData = computed(
    (): ProductListData => ({
      products: this.responseSignal()?.data || [],
      meta: this.responseSignal()?.meta,
      isLoading: this.loadingSignal(),
      error: this.errorSignal(),
      totalCartItems: this.cartService.totalItems(),
    }),
  );

  ngOnInit(): void {
    this.loadProducts();
  }

  onSearchChange(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
    this.loadProducts();
  }

  onAddToCart(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const params = {
      search: this.searchTerm() || undefined,
      page: this.currentPage(),
      limit: this.itemsPerPage,
    };

    this.productService
      .searchProducts(params)
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: response => this.responseSignal.set(response),
        error: error => {
          this.errorSignal.set('Erro ao carregar produtos. Tente novamente.');
          console.error('Erro ao carregar produtos:', error);
        },
      });
  }
}
