import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../../../core/services/cart.service';
import { Cart, CartItem } from '../../../../core/models/cart.model';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>
      <div class="cart-content" *ngIf="cart && cart.items.length > 0; else emptyCart">
        <div class="cart-items">
          <div class="cart-item" *ngFor="let item of cart.items">
            <div class="item-image">
              <img [src]="item.imageUrl || 'assets/placeholder-image.jpg'" [alt]="item.title">
            </div>
            <div class="item-details">
              <h3>{{item.title}}</h3>
              <p *ngIf="item.variantTitle">Variant: {{item.variantTitle}}</p>
              <div class="item-price">LKR{{item.price.toFixed(2)}}</div>
              <div class="item-quantity">
                <button (click)="decreaseQuantity(item)" [disabled]="item.quantity <= 1">-</button>
                <span>{{item.quantity}}</span>
                <button (click)="increaseQuantity(item)" [disabled]="item.maxQuantity !== undefined && item.quantity >= item.maxQuantity">+</button>
              </div>
            </div>
            <div class="item-total">
              <span>LKR{{(item.price * item.quantity).toFixed(2)}}</span>
              <button class="remove-btn" (click)="removeItem(item)">Remove</button>
            </div>
          </div>
        </div>
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-item">
            <span>Subtotal</span>
            <span>LKR{{cart.subtotal.toFixed(2)}}</span>
          </div>
          <div class="summary-item">
            <span>Shipping</span>
            <span>LKR{{cart.shippingCost.toFixed(2)}}</span>
          </div>
          <div class="summary-item" *ngIf="cart.discount > 0">
            <span>Discount</span>
            <span>-LKR{{cart.discount.toFixed(2)}}</span>
          </div>
          <div class="summary-item">
            <span>Tax</span>
            <span>LKR{{cart.tax.toFixed(2)}}</span>
          </div>
          <div class="summary-item total">
            <span>Total</span>
            <span>LKR{{cart.total.toFixed(2)}}</span>
          </div>
          <button class="checkout-btn" (click)="proceedToCheckout()">Proceed to Checkout</button>
          <button class="clear-cart-btn" (click)="clearCart()">Clear Cart</button>
        </div>
      </div>
      <ng-template #emptyCart>
        <div class="empty-cart">
          <i class="fas fa-shopping-cart empty-cart-icon"></i>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <button class="continue-shopping-btn" routerLink="/shop">Continue Shopping</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .cart-container {
      max-width: 1200px;
      margin: 2rem auto;
      padding: 0 1rem;
    }

    h1 {
      color: #333;
      margin-bottom: 2rem;
    }

    .cart-content {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 2rem;
    }

    .cart-items {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .cart-item {
      display: grid;
      grid-template-columns: 100px 1fr auto;
      gap: 1rem;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }

    .cart-item:last-child {
      border-bottom: none;
    }

    .item-image img {
      width: 100%;
      height: 100px;
      object-fit: cover;
      border-radius: 4px;
    }

    .item-details h3 {
      margin: 0 0 0.5rem;
      font-size: 1rem;
    }

    .item-price {
      color: #666;
      margin-bottom: 0.5rem;
    }

    .item-quantity {
      display: flex;
      align-items: center;
    }

    .item-quantity button {
      background: #f5f5f5;
      border: 1px solid #ddd;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .item-quantity button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .item-quantity span {
      padding: 0 10px;
    }

    .item-total {
      text-align: right;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    .remove-btn {
      background: none;
      border: none;
      color: #e74c3c;
      cursor: pointer;
      font-size: 0.9rem;
    }

    .cart-summary {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      height: fit-content;
    }

    h2 {
      color: #333;
      margin-bottom: 1.5rem;
    }

    .summary-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      color: #666;
    }

    .summary-item.total {
      font-weight: bold;
      color: #333;
      font-size: 1.2rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }

    .checkout-btn {
      width: 100%;
      padding: 1rem;
      background-color: #ff4747;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.2s ease;
    }

    .checkout-btn:hover {
      background-color: #e63c3c;
    }

    .clear-cart-btn {
      width: 100%;
      padding: 0.8rem;
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
    }

    .empty-cart {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .empty-cart-icon {
      font-size: 4rem;
      color: #ccc;
      margin-bottom: 1rem;
    }

    .continue-shopping-btn {
      padding: 0.8rem 1.5rem;
      background-color: #ff4747;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: all 0.2s ease;
    }

    .continue-shopping-btn:hover {
      background-color: #e63c3c;
    }
  `]
})
export class CartComponent implements OnInit {
  cart: Cart | null = null;

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cart$.subscribe(cart => {
      this.cart = cart;
    });
  }

  increaseQuantity(item: CartItem): void {
    if (item && item.id) {
      this.cartService.updateItemQuantity(item.id, item.quantity + 1);
    }
  }

  decreaseQuantity(item: CartItem): void {
    if (item && item.id && item.quantity > 1) {
      this.cartService.updateItemQuantity(item.id, item.quantity - 1);
    }
  }

  removeItem(item: CartItem): void {
    if (item && item.id) {
      this.cartService.removeItem(item.id);
    }
  }

  clearCart(): void {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart();
    }
  }

  proceedToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
} 