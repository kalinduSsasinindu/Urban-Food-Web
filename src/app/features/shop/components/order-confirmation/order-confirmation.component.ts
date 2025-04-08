import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="confirmation-container">
      <div class="confirmation-card" *ngIf="order; else loading">
        <div class="success-icon">
          <i class="fas fa-check-circle"></i>
        </div>
        <h1>Order Confirmed!</h1>
        <p class="thank-you">Thank you for your purchase.</p>
        
        <div class="order-details">
          <div class="detail-row">
            <span>Order Number:</span>
            <span>{{ order.name || order.id }}</span>
          </div>
          <div class="detail-row">
            <span>Order Date:</span>
            <span>{{ order.timeLineDetails && order.timeLineDetails[0]?.createdAt | date:'medium' }}</span>
          </div>
          <div class="detail-row">
            <span>Total Amount:</span>
            <span>LKR{{ order.totalPrice.toFixed(2) }}</span>
          </div>
          <div class="detail-row">
            <span>Payment Method:</span>
            <span>{{ getPaymentMethodDisplay(order.paymentInfo.paymentOption) }}</span>
          </div>
        </div>
        
        <div class="shipping-info">
          <h2>Shipping Information</h2>
          <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
          <p>{{ order.shippingAddress.address1 }}</p>
          <p>{{ order.shippingAddress.city }}</p>
          <p>Phone: {{ order.shippingAddress.phone }}</p>
        </div>
        
        <div class="item-list">
          <h2>Items Ordered</h2>
          <div class="item" *ngFor="let item of order.lineItems">
            <div class="item-details">
              <span class="item-title">{{ item.title }}</span>
              <span class="item-variant" *ngIf="item.variantTitle">{{ item.variantTitle }}</span>
            </div>
            <div class="item-price">
              <span>{{ item.quantity }} × LKR{{ item.price.toFixed(2) }}</span>
              <span>LKR{{ (item.quantity * item.price).toFixed(2) }}</span>
            </div>
          </div>
        </div>
        
        <div class="summary">
          <div class="summary-row">
            <span>Subtotal:</span>
            <span>LKR{{ order.subtotalPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Shipping:</span>
            <span>LKR{{ order.totalShippingPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row" *ngIf="order.totalDiscountPrice > 0">
            <span>Discount:</span>
            <span>-LKR{{ order.totalDiscountPrice.toFixed(2) }}</span>
          </div>
          <div class="summary-row">
            <span>Tax:</span>
            <span>LKR{{ (order.totalPrice - order.subtotalPrice - order.totalShippingPrice + order.totalDiscountPrice).toFixed(2) }}</span>
          </div>
          <div class="summary-row total">
            <span>Total:</span>
            <span>LKR{{ order.totalPrice.toFixed(2) }}</span>
          </div>
        </div>
        
        <div class="actions">
          <a routerLink="/shop" class="continue-btn">Continue Shopping</a>
          <a routerLink="/account/orders" class="view-orders-btn">View My Orders</a>
        </div>
        
        <div class="bank-details" *ngIf="order.paymentInfo.paymentOption === 'BANK_TRANSFER'">
          <h2>Bank Transfer Details</h2>
          <p>Please transfer the payment to the following bank account:</p>
          <div class="bank-info">
            <p><strong>Bank:</strong> People's Bank</p>
            <p><strong>Account Name:</strong> Urban Food Web</p>
            <p><strong>Account Number:</strong> 123-456-789-10</p>
            <p><strong>Branch:</strong> Colombo Main</p>
            <p><strong>Reference:</strong> {{ order.name || order.id }}</p>
          </div>
          <p class="note">Please include your order number as reference. Your order will be processed after payment confirmation.</p>
        </div>
      </div>
      
      <ng-template #loading>
        <div class="loading-container">
          <div class="spinner"></div>
          <p>Loading order details...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .confirmation-container {
      max-width: 800px;
      margin: 3rem auto;
      padding: 0 1rem;
    }
    
    .confirmation-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    
    .success-icon {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    
    .success-icon i {
      font-size: 4rem;
      color: #2ecc71;
    }
    
    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 0.5rem;
    }
    
    .thank-you {
      text-align: center;
      color: #666;
      margin-bottom: 2rem;
    }
    
    .order-details {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .detail-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      font-size: 0.95rem;
    }
    
    .detail-row:last-child {
      margin-bottom: 0;
    }
    
    h2 {
      color: #333;
      font-size: 1.2rem;
      margin-bottom: 1rem;
    }
    
    .shipping-info {
      margin-bottom: 2rem;
    }
    
    .shipping-info p {
      margin: 0.3rem 0;
      color: #555;
    }
    
    .item-list {
      margin-bottom: 2rem;
    }
    
    .item {
      display: flex;
      justify-content: space-between;
      padding: 1rem 0;
      border-bottom: 1px solid #eee;
    }
    
    .item:last-child {
      border-bottom: none;
    }
    
    .item-details {
      display: flex;
      flex-direction: column;
    }
    
    .item-title {
      font-weight: 500;
    }
    
    .item-variant {
      color: #777;
      font-size: 0.9rem;
      margin-top: 0.3rem;
    }
    
    .item-price {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
    }
    
    .summary {
      background: #f9f9f9;
      border-radius: 8px;
      padding: 1.5rem;
      margin-bottom: 2rem;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
    }
    
    .summary-row.total {
      font-weight: bold;
      color: #333;
      font-size: 1.1rem;
      margin-top: 0.8rem;
      padding-top: 0.8rem;
      border-top: 1px solid #ddd;
    }
    
    .actions {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    
    .continue-btn, .view-orders-btn {
      flex: 1;
      padding: 1rem;
      text-align: center;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.3s ease;
    }
    
    .continue-btn {
      background-color: #3498db;
      color: white;
    }
    
    .continue-btn:hover {
      background-color: #2980b9;
    }
    
    .view-orders-btn {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .view-orders-btn:hover {
      background-color: #e8e8e8;
    }
    
    .bank-details {
      background: #f0f8ff;
      border: 1px solid #d1e6fa;
      border-radius: 8px;
      padding: 1.5rem;
    }
    
    .bank-info {
      margin: 1rem 0;
    }
    
    .bank-info p {
      margin: 0.5rem 0;
    }
    
    .note {
      color: #666;
      font-size: 0.9rem;
      font-style: italic;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 300px;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 576px) {
      .actions {
        flex-direction: column;
      }
    }
  `]
})
export class OrderConfirmationComponent implements OnInit {
  order: Order | null = null;
  orderId: string | null = null;
  error: string | null = null;
  
  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) {}
  
  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.orderId = params.get('id');
      if (this.orderId) {
        this.loadOrderDetails(this.orderId);
      }
    });
  }
  
  loadOrderDetails(orderId: string): void {
    this.orderService.getOrderById(orderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        console.error('Error loading order details:', error);
        this.error = 'Could not load order details. Please try again later.';
      }
    });
  }
  
  getPaymentMethodDisplay(paymentOption: string): string {
    switch(paymentOption) {
      case 'CASH_ON_DELIVERY':
        return 'Cash on Delivery';
      case 'CREDIT_CARD':
        return 'Credit Card';
      case 'BANK_TRANSFER':
        return 'Bank Transfer';
      case 'PAYPAL':
        return 'PayPal';
      default:
        return paymentOption;
    }
  }
} 