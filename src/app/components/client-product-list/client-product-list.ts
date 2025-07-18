import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ProductService } from '../../services/product';
import { ShoppingCartService } from '../../services/shopping-cart';
import { Product } from '../../models/product';
import { ProductListData } from '../../models/product-list-data';
import { ProductListComponent } from '../product-list/product-list';

@Component({
  selector: 'app-client-product-list',
  imports: [ProductListComponent],
  templateUrl: './client-product-list.html',
})
export class ClientProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(ShoppingCartService);
  private readonly router = inject(Router);

  private readonly allProductsSignal = signal<Product[]>([]);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);

  readonly searchTerm = signal('');
  readonly currentPage = signal(1);
  readonly itemsPerPage = 10;

  readonly filteredProducts = computed(() => {
    const allProducts = this.allProductsSignal();
    const search = this.searchTerm().toLowerCase().trim();

    if (!search) {
      return allProducts;
    }

    return allProducts.filter(
      product =>
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search),
    );
  });

  readonly totalItems = computed(() => this.filteredProducts().length);
  readonly totalPages = computed(() => Math.ceil(this.totalItems() / this.itemsPerPage));

  readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;

    return filtered.slice(startIndex, endIndex);
  });

  readonly paginationMeta = computed(() => {
    const currentPage = this.currentPage();
    const totalPages = this.totalPages();
    const totalItems = this.totalItems();

    return totalPages > 1
      ? {
          total: totalItems,
          page: currentPage,
          limit: this.itemsPerPage,
          totalPages,
          hasNextPage: currentPage < totalPages,
          hasPreviousPage: currentPage > 1,
        }
      : undefined;
  });

  readonly listData = computed(
    (): ProductListData => ({
      products: this.paginatedProducts(),
      meta: this.paginationMeta(),
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
    this.currentPage.set(1); // Reset para primeira página ao buscar
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onAddToCart(product: Product): void {
    this.router.navigate(['/product', product.id]);
  }

  loadProducts(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.productService
      .getAllProducts()
      .pipe(finalize(() => this.loadingSignal.set(false)))
      .subscribe({
        next: products => {
          this.allProductsSignal.set(products);
        },
        error: error => {
          this.errorSignal.set('Erro ao carregar produtos. Tente novamente.');
          console.error('Erro ao carregar produtos:', error);
        },
      });
  }
}
