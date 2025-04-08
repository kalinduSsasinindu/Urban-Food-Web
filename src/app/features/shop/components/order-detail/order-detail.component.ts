import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="order-detail-container">
      <div class="breadcrumb">
        <a routerLink="/account/orders">Orders</a> / Order Details
      </div>

      <div class="order-detail-card" *ngIf="order; else loading">
        <div class="order-header">
          <div>
            <h1>Order #{{ order.name || order.id }}</h1>
            <p class="order-date">Placed on {{ order.timeLineDetails && order.timeLineDetails[0]?.createdAt | date:'medium' }}</p>
          </div>
          <div class="order-status">
            <span class="status-badge" [ngClass]="getStatusClass(order.fulfillmentStatus)">
              {{ order.fulfillmentStatus }}
            </span>
          </div>
        </div>
        
        <div class="order-sections">
          <div class="order-section">
            <h2>Items Ordered</h2>
            <div class="items-list">
              <div class="item" *ngFor="let item of order.lineItems">
                <div class="item-image" *ngIf="item.imageUrl">
                  <img [src]="item.imageUrl" [alt]="item.title">
                </div>
                <div class="item-details">
                  <h3>{{ item.title }}</h3>
                  <p *ngIf="item.variantTitle">{{ item.variantTitle }}</p>
                  <p class="item-price">LKR{{ item.price.toFixed(2) }} × {{ item.quantity }}</p>
                </div>
                <div class="item-total">
                  LKR{{ (item.price * item.quantity).toFixed(2) }}
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-section-grid">
            <div class="order-section">
              <h2>Shipping Address</h2>
              <div class="address-details">
                <p>{{ order.shippingAddress.firstName }} {{ order.shippingAddress.lastName }}</p>
                <p>{{ order.shippingAddress.address1 }}</p>
                <p>{{ order.shippingAddress.city }}</p>
                <p>Phone: {{ order.shippingAddress.phone }}</p>
              </div>
            </div>
            
            <div class="order-section">
              <h2>Payment Information</h2>
              <div class="payment-details">
                <p><strong>Method:</strong> {{ getPaymentMethodDisplay(order.paymentInfo.paymentOption) }}</p>
                <p><strong>Status:</strong> {{ order.financialStatus }}</p>
                
                <div class="bank-details" *ngIf="order.paymentInfo.paymentOption === 'BANK_TRANSFER'">
                  <h3>Bank Transfer Details</h3>
                  <p>Please transfer the payment to:</p>
                  <p><strong>Bank:</strong> People's Bank</p>
                  <p><strong>Account Name:</strong> Urban Food Web</p>
                  <p><strong>Account Number:</strong> 123-456-789-10</p>
                  <p><strong>Reference:</strong> {{ order.name || order.id }}</p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="order-section">
            <h2>Order Summary</h2>
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal</span>
                <span>LKR{{ order.subtotalPrice.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Shipping</span>
                <span>LKR{{ order.totalShippingPrice.toFixed(2) }}</span>
              </div>
              <div class="summary-row" *ngIf="order.totalDiscountPrice > 0">
                <span>Discount</span>
                <span>-LKR{{ order.totalDiscountPrice.toFixed(2) }}</span>
              </div>
              <div class="summary-row">
                <span>Tax</span>
                <span>LKR{{ (order.totalPrice - order.subtotalPrice - order.totalShippingPrice + order.totalDiscountPrice).toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total</span>
                <span>LKR{{ order.totalPrice.toFixed(2) }}</span>
              </div>
            </div>
          </div>
          
          <div class="order-section" *ngIf="order.timeLineDetails && order.timeLineDetails.length > 0">
            <h2>Order Timeline</h2>
            <div class="timeline">
              <div class="timeline-entry" *ngFor="let entry of order.timeLineDetails">
                <div class="timeline-date">
                  {{ entry.createdAt | date:'short' }}
                </div>
                <div class="timeline-content">
                  <div class="timeline-status">{{ entry.comment }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="order-actions">
          <a routerLink="/account/orders" class="back-btn">Back to Orders</a>
          <button *ngIf="canCancelOrder()" class="cancel-btn" (click)="cancelOrder()">Cancel Order</button>
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
    .order-detail-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    .breadcrumb {
      margin-bottom: 1.5rem;
      color: #666;
    }
    
    .breadcrumb a {
      color: #3498db;
      text-decoration: none;
    }
    
    .breadcrumb a:hover {
      text-decoration: underline;
    }
    
    .order-detail-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 2rem;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 2rem;
    }
    
    h1 {
      margin: 0 0 0.5rem 0;
      font-size: 1.5rem;
      color: #333;
    }
    
    .order-date {
      color: #777;
      margin: 0;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-weight: 500;
    }
    
    .status-pending {
      background-color: #fff8e1;
      color: #f57c00;
    }
    
    .status-processing {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .status-shipped {
      background-color: #e8f5e9;
      color: #388e3c;
    }
    
    .status-delivered {
      background-color: #e8f5e9;
      color: #388e3c;
    }
    
    .status-cancelled {
      background-color: #ffebee;
      color: #d32f2f;
    }
    
    .order-sections {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }
    
    .order-section {
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    
    .order-section:last-child {
      border-bottom: none;
      padding-bottom: 0;
    }
    
    .order-section-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
    }
    
    h2 {
      font-size: 1.2rem;
      color: #333;
      margin-bottom: 1.2rem;
    }
    
    h3 {
      font-size: 1.1rem;
      margin: 0 0 0.5rem 0;
    }
    
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    
    .item {
      display: grid;
      grid-template-columns: auto 1fr auto;
      gap: 1.5rem;
      align-items: center;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-details p {
      margin: 0.2rem 0;
      color: #666;
    }
    
    .item-price {
      font-weight: 500;
    }
    
    .item-total {
      font-weight: 600;
      font-size: 1.1rem;
    }
    
    .address-details p, .payment-details p {
      margin: 0.5rem 0;
      color: #555;
    }
    
    .bank-details {
      margin-top: 1rem;
      padding: 1rem;
      background-color: #f8f9fa;
      border-radius: 4px;
    }
    
    .bank-details h3 {
      font-size: 1rem;
      margin-bottom: 0.5rem;
    }
    
    .bank-details p {
      margin: 0.3rem 0;
    }
    
    .order-summary {
      max-width: 400px;
      margin-left: auto;
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
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #ddd;
    }
    
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .timeline-entry {
      display: grid;
      grid-template-columns: 150px 1fr;
      gap: 1rem;
    }
    
    .timeline-date {
      color: #777;
      font-size: 0.9rem;
    }
    
    .timeline-status {
      font-weight: 500;
      margin-bottom: 0.3rem;
    }
    
    .timeline-comment {
      color: #555;
    }
    
    .order-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }
    
    .back-btn, .cancel-btn {
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      text-decoration: none;
      font-weight: 500;
      transition: background-color 0.3s;
      cursor: pointer;
    }
    
    .back-btn {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .back-btn:hover {
      background-color: #e8e8e8;
    }
    
    .cancel-btn {
      background-color: #f44336;
      color: white;
      border: none;
    }
    
    .cancel-btn:hover {
      background-color: #d32f2f;
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
    
    @media (max-width: 768px) {
      .order-section-grid {
        grid-template-columns: 1fr;
      }
      
      .item {
        grid-template-columns: 1fr;
      }
      
      .item-image {
        margin: 0 auto;
      }
      
      .item-total {
        text-align: right;
      }
    }
  `]
})
export class OrderDetailComponent implements OnInit {
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
  
  getStatusClass(status: string | undefined): string {
    if (!status) return '';
    
    status = status.toLowerCase();
    
    if (status.includes('pending')) {
      return 'status-pending';
    } else if (status.includes('processing')) {
      return 'status-processing';
    } else if (status.includes('shipped')) {
      return 'status-shipped';
    } else if (status.includes('delivered')) {
      return 'status-delivered';
    } else if (status.includes('cancelled')) {
      return 'status-cancelled';
    }
    
    return '';
  }
  
  canCancelOrder(): boolean {
    if (!this.order || !this.order.fulfillmentStatus) return false;
    
    // Allow cancellation only if the order is in certain states
    const status = this.order.fulfillmentStatus.toLowerCase();
    return (status.includes('pending') || status.includes('unfulfilled')) && 
           !status.includes('shipped') && 
           !status.includes('delivered') && 
           !this.order.isCancelled;
  }
  
  cancelOrder(): void {
    if (!this.order || !this.orderId) return;
    
    if (confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      this.orderService.cancelOrder(this.orderId).subscribe({
        next: () => {
          // Refresh order details after cancellation
          this.loadOrderDetails(this.orderId!);
          alert('Order has been cancelled successfully.');
        },
        error: (error) => {
          console.error('Error cancelling order:', error);
          alert('Failed to cancel order. Please try again later.');
        }
      });
    }
  }
} 