import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  LucideAngularModule,
  ArrowLeft,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
} from 'lucide-angular';

import { ShoppingCartService } from '../../services/shopping-cart';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink, LucideAngularModule],
  templateUrl: './cart.html',
  styleUrl: './cart.scss',
})
export class CartComponent {
  private readonly cartService = inject(ShoppingCartService);

  readonly cartItems = this.cartService.cartItems;
  readonly totalItems = this.cartService.totalItems;
  readonly totalPrice = this.cartService.totalPrice;
  readonly isEmpty = this.cartService.isEmpty;

  readonly hasItems = computed(() => !this.isEmpty());

  readonly icons = { ArrowLeft, ShoppingCart, Plus, Minus, Trash2, ShoppingBag };

  increaseQuantity(productId: number): void {
    const currentItem = this.cartItems().find(item => item.productId === productId);
    if (currentItem) {
      this.cartService.updateQuantity(productId, currentItem.quantity + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const currentItem = this.cartItems().find(item => item.productId === productId);
    if (currentItem) {
      this.cartService.updateQuantity(productId, currentItem.quantity - 1);
    }
  }

  removeItem(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  clearCart(): void {
    if (confirm('Tem certeza que deseja esvaziar o carrinho?')) {
      this.cartService.clearCart();
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(price);
  }
}
