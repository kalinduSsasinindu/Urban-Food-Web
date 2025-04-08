import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Cart, CartItem } from '../models/cart.model';
import { Product, ProductVariant } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'urban_food_cart';
  private cartSubject = new BehaviorSubject<Cart>(this.initializeCart());
  cart$ = this.cartSubject.asObservable();

  constructor() {
    this.loadCartFromStorage();
  }

  private initializeCart(): Cart {
    return {
      items: [],
      subtotal: 0,
      tax: 0,
      shippingCost: 0,
      discount: 0,
      total: 0
    };
  }

  private loadCartFromStorage(): void {
    const cartJson = localStorage.getItem(this.CART_STORAGE_KEY);
    if (cartJson) {
      try {
        const storedCart = JSON.parse(cartJson);
        this.cartSubject.next(storedCart);
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        this.cartSubject.next(this.initializeCart());
      }
    }
  }

  private saveCartToStorage(): void {
    const cartJson = JSON.stringify(this.cartSubject.value);
    localStorage.setItem(this.CART_STORAGE_KEY, cartJson);
  }

  private calculateCartTotals(cart: Cart): Cart {
    // Calculate subtotal (sum of item prices * quantities)
    cart.subtotal = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    // Calculate tax (assume 5% tax rate for now)
    cart.tax = cart.subtotal * 0.05;
    
    // Shipping is free for orders over 5000, otherwise 300
    cart.shippingCost = cart.subtotal > 5000 ? 0 : 300;
    
    // Calculate total
    cart.total = cart.subtotal + cart.tax + cart.shippingCost - cart.discount;
    
    return cart;
  }

  addToCart(product: Product, variant: ProductVariant, quantity: number): void {
    const currentCart = { ...this.cartSubject.value };
    
    // Generate a unique id for the cart item
    const itemId = `${product.id}-${variant.variantId}`;
    
    // Check if the item already exists in the cart
    const existingItemIndex = currentCart.items.findIndex(
      item => item.productId === product.id && item.variantId === variant.variantId
    );
    
    // Get image URL
    const imageUrl = product.imgUrls && product.imgUrls.length > 0 ? 
      product.imgUrls[0] : 'assets/placeholder-image.jpg';
    
    if (existingItemIndex >= 0) {
      // Update existing item
      currentCart.items[existingItemIndex].quantity += quantity;
      
      // Ensure quantity doesn't exceed available stock
      if (variant.availableQuantity !== undefined) {
        currentCart.items[existingItemIndex].maxQuantity = variant.availableQuantity;
        if (currentCart.items[existingItemIndex].quantity > variant.availableQuantity) {
          currentCart.items[existingItemIndex].quantity = variant.availableQuantity;
        }
      }
    } else {
      // Add new item
      const newItem: CartItem = {
        id: itemId,
        productId: product.id,
        variantId: variant.variantId,
        title: product.title,
        price: variant.price || 0,
        quantity: quantity,
        imageUrl: imageUrl,
        variantTitle: variant.name,
        maxQuantity: variant.availableQuantity
      };
      currentCart.items.push(newItem);
    }
    
    // Update cart totals
    const updatedCart = this.calculateCartTotals(currentCart);
    
    // Update cart state
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  updateItemQuantity(itemId: string, quantity: number): void {
    const currentCart = { ...this.cartSubject.value };
    const itemIndex = currentCart.items.findIndex(item => item.id === itemId);
    
    if (itemIndex >= 0) {
      // Ensure quantity is positive and doesn't exceed max
      quantity = Math.max(1, quantity);
      
      // Fix the type error by checking if maxQuantity exists before using it
      const maxQuantity = currentCart.items[itemIndex].maxQuantity;
      if (maxQuantity !== undefined) {
        quantity = Math.min(quantity, maxQuantity);
      }
      
      currentCart.items[itemIndex].quantity = quantity;
      
      // Update cart totals
      const updatedCart = this.calculateCartTotals(currentCart);
      
      // Update cart state
      this.cartSubject.next(updatedCart);
      this.saveCartToStorage();
    }
  }

  removeItem(itemId: string): void {
    const currentCart = { ...this.cartSubject.value };
    currentCart.items = currentCart.items.filter(item => item.id !== itemId);
    
    // Update cart totals
    const updatedCart = this.calculateCartTotals(currentCart);
    
    // Update cart state
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartSubject.next(this.initializeCart());
    this.saveCartToStorage();
  }

  getCartItemCount(): Observable<number> {
    return new Observable<number>(observer => {
      this.cart$.subscribe(cart => {
        const count = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        observer.next(count);
      });
    });
  }

  applyDiscount(discountAmount: number): void {
    const currentCart = { ...this.cartSubject.value };
    currentCart.discount = discountAmount;
    
    // Update cart totals
    const updatedCart = this.calculateCartTotals(currentCart);
    
    // Update cart state
    this.cartSubject.next(updatedCart);
    this.saveCartToStorage();
  }
} 