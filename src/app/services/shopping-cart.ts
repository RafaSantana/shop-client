import { Injectable, computed, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

export interface CartItemWithProduct extends CartItem {
  product: Product;
  totalPrice: number;
}

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartService {
  private readonly cartItemsSignal = signal<CartItemWithProduct[]>([]);

  readonly cartItems = this.cartItemsSignal.asReadonly();

  readonly totalItems = computed(() =>
    this.cartItems().reduce((total, item) => total + item.quantity, 0),
  );

  readonly totalPrice = computed(() =>
    this.cartItems().reduce((total, item) => total + item.totalPrice, 0),
  );

  readonly isEmpty = computed(() => this.cartItems().length === 0);

  /**
   * Adiciona um produto ao carrinho
   * @param product Produto a ser adicionado
   * @param quantity Quantidade do produto (padrão é 1)
   */
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = this.cartItemsSignal();
    const existingItemIndex = currentItems.findIndex(item => item.productId === product.id);

    if (existingItemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + quantity,
        totalPrice: (updatedItems[existingItemIndex].quantity + quantity) * product.price,
      };
      this.cartItemsSignal.set(updatedItems);
    } else {
      const newItem: CartItemWithProduct = {
        productId: product.id,
        quantity,
        product,
        totalPrice: quantity * product.price,
      };
      this.cartItemsSignal.set([...currentItems, newItem]);
    }
  }

  /**
   * Remove um produto do carrinho
   */
  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSignal();
    const updatedItems = currentItems.filter(item => item.productId !== productId);
    this.cartItemsSignal.set(updatedItems);
  }

  /**
   * Atualiza a quantidade de um item
   */
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = this.cartItemsSignal();
    const itemIndex = currentItems.findIndex(item => item.productId === productId);

    if (itemIndex >= 0) {
      const updatedItems = [...currentItems];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity,
        totalPrice: quantity * updatedItems[itemIndex].product.price,
      };
      this.cartItemsSignal.set(updatedItems);
    }
  }

  /**
   * Limpa todo o carrinho
   */
  clearCart(): void {
    this.cartItemsSignal.set([]);
  }
}
