import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="cart-container">
      <h1>Shopping Cart</h1>
      <div class="cart-content">
        <div class="cart-items">
          <!-- Cart items will be displayed here -->
          <p>Your cart is empty</p>
        </div>
        <div class="cart-summary">
          <h2>Order Summary</h2>
          <div class="summary-item">
            <span>Subtotal</span>
            <span>$0.00</span>
          </div>
          <div class="summary-item">
            <span>Delivery Fee</span>
            <span>$0.00</span>
          </div>
          <div class="summary-item total">
            <span>Total</span>
            <span>$0.00</span>
          </div>
          <button class="checkout-btn" [routerLink]="['/checkout']">Proceed to Checkout</button>
        </div>
      </div>
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
      background-color: #2ecc71;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 1rem;
      cursor: pointer;
      margin-top: 1rem;
      transition: background-color 0.3s ease;
    }

    .checkout-btn:hover {
      background-color: #27ae60;
    }
  `]
})
export class CartComponent {
  // Cart functionality will be implemented here
} 