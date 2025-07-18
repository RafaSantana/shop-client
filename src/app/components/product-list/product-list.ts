import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  Search,
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
} from 'lucide-angular';

import { Product } from '../../models/product';
import { ProductListData } from '../../models/product-list-data';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent {
  // ===== INPUTS =====
  readonly data = input.required<ProductListData>();
  readonly searchTerm = input('');
  readonly currentPage = input(1);
  readonly title = input('🛍️ Produtos');
  readonly subtitle = input('Lista de produtos');

  // ===== OUTPUTS =====
  readonly searchChange = output<string>();
  readonly pageChange = output<number>();
  readonly productClick = output<Product>();
  readonly retryClick = output<void>();

  // ===== COMPUTED VALUES - DATA =====
  readonly products = computed(() => this.data().products);
  readonly meta = computed(() => this.data().meta);
  readonly isLoading = computed(() => this.data().isLoading);
  readonly error = computed(() => this.data().error);
  readonly totalCartItems = computed(() => this.data().totalCartItems);

  // ===== COMPUTED VALUES - STATES =====
  readonly hasProducts = computed(() => this.products().length > 0);
  readonly isEmpty = computed(
    () => !this.isLoading() && !this.error() && this.products().length === 0,
  );
  readonly showContent = computed(() => !this.isLoading() && !this.error());
  readonly showPagination = computed(() => {
    const meta = this.meta();
    return meta && meta.totalPages > 1;
  });

  // ===== COMPUTED VALUES - PAGINATION =====
  readonly paginationInfo = computed(() => {
    const meta = this.meta();
    if (!meta) return null;

    const start = (meta.page - 1) * meta.limit + 1;
    const end = Math.min(meta.page * meta.limit, meta.total);

    return {
      start,
      end,
      total: meta.total,
      currentPage: meta.page,
      totalPages: meta.totalPages,
      hasNext: meta.hasNextPage,
      hasPrevious: meta.hasPreviousPage,
    };
  });

  // ===== ICONS =====
  readonly icons = { Search, ChevronLeft, ChevronRight, ShoppingCart };

  // ===== EVENT HANDLERS =====
  onSearchChange(term: string): void {
    // Valida se é uma string válida antes de emitir
    const cleanTerm = term?.trim() || '';
    this.searchChange.emit(cleanTerm);
  }

  onSearchSubmit(): void {
    // Usa o termo atual do input para busca
    const cleanTerm = this.searchTerm()?.trim() || '';
    this.searchChange.emit(cleanTerm);
  }

  onPageChange(page: number): void {
    const meta = this.meta();
    if (!meta) return;

    // Valida se a página está dentro dos limites
    if (page >= 1 && page <= meta.totalPages && page !== meta.page) {
      this.pageChange.emit(page);
    }
  }

  onAddToCart(product: Product): void {
    if (product?.id) {
      this.productClick.emit(product);
    }
  }

  onRetry(): void {
    this.retryClick.emit();
  }

  // ===== UTILITY METHODS =====
  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }

  // Método para gerar array de páginas para a paginação
  getPaginationPages(): number[] {
    const pagination = this.paginationInfo();
    if (!pagination) return [];

    const { currentPage, totalPages } = pagination;
    const pages: number[] = [];

    // Lógica para mostrar no máximo 5 páginas
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // Ajusta o início se estivermos no final
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}
