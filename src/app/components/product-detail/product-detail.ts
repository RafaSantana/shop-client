import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, ArrowLeft, ShoppingCart, Plus, Minus } from 'lucide-angular';
import { finalize, firstValueFrom } from 'rxjs';

import { ProductService } from '../../services/product';
import { ShoppingCartService } from '../../services/shopping-cart';
import { Product } from '../../models/product';

@Component({
  selector: 'app-product-detail',
  imports: [CommonModule, FormsModule, RouterLink, LucideAngularModule],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss',
})
export class ProductDetailComponent implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly cartService = inject(ShoppingCartService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  private readonly productSignal = signal<Product | null>(null);
  private readonly loadingSignal = signal(false);
  private readonly errorSignal = signal<string | null>(null);
  private readonly addingToCartSignal = signal(false);

  readonly quantity = signal(1);

  readonly product = this.productSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly isAddingToCart = this.addingToCartSignal.asReadonly();
  readonly totalCartItems = computed(() => this.cartService.totalItems());

  readonly totalPrice = computed(() => {
    const product = this.product();
    return product ? product.price * this.quantity() : 0;
  });

  readonly canAddToCart = computed(() => {
    return this.product() && this.quantity() > 0 && !this.isAddingToCart();
  });

  readonly icons = { ArrowLeft, ShoppingCart, Plus, Minus };

  ngOnInit(): void {
    const productId = this.route.snapshot.paramMap.get('id');

    if (!productId || isNaN(Number(productId))) {
      this.router.navigate(['/home']);
      return;
    }

    this.loadProduct(Number(productId));
  }

  async loadProduct(id: number): Promise<void> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    try {
      const product = await firstValueFrom(
        this.productService.getProductById(id).pipe(finalize(() => this.loadingSignal.set(false))),
      );
      this.productSignal.set(product);
    } catch (error) {
      this.errorSignal.set('Erro ao carregar produto. Tente novamente.');
      console.error('Erro ao carregar produto:', error);
    }
  }

  increaseQuantity(): void {
    this.quantity.update(current => current + 1);
  }

  decreaseQuantity(): void {
    this.quantity.update(current => Math.max(1, current - 1));
  }

  onQuantityChange(value: string): void {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue > 0) {
      this.quantity.set(numValue);
    }
  }

  async addToCart(): Promise<void> {
    const product = this.product();
    if (!this.canAddToCart() || !product) {
      return;
    }

    this.addingToCartSignal.set(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 300));

      this.cartService.addToCart(product, this.quantity());

      this.quantity.set(1);

      console.log(`${this.quantity()} item(s) de "${product.name}" adicionado(s) ao carrinho`);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
    } finally {
      this.addingToCartSignal.set(false);
    }
  }

  onRetry(): void {
    const productId = this.route.snapshot.paramMap.get('id');
    if (productId && !isNaN(Number(productId))) {
      this.loadProduct(Number(productId));
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
