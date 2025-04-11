import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { Order } from '../../../../core/models/order.model';

@Component({
  selector: 'app-seller-order-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="order-detail-container">
      <div class="breadcrumb">
        <a routerLink="/seller/orders">Orders</a> / Order Details
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
            <h2>Your Products in This Order</h2>
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
              </div>
            </div>
          </div>
          
          <div class="order-section">
            <h2>Your Items Summary</h2>
            <div class="order-summary">
              <div class="summary-row">
                <span>Subtotal (Your Items)</span>
                <span>LKR{{ calculateSubtotal().toFixed(2) }}</span>
              </div>
              <div class="summary-row total">
                <span>Total (Your Items)</span>
                <span>LKR{{ calculateSubtotal().toFixed(2) }}</span>
              </div>
              <div class="note">
                <em>Note: This summary shows only the amount for your products in this order.</em>
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
          <a routerLink="/seller/orders" class="back-btn">Back to Orders</a>
          <button *ngIf="canUpdateStatus()" class="update-btn">Update Fulfillment Status</button>
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
      background-color: #f9f9f9;
      border-radius: 8px;
      padding: 1.5rem;
    }
    
    .order-section h2 {
      margin-top: 0;
      margin-bottom: 1.2rem;
      font-size: 1.2rem;
      color: #333;
    }
    
    .order-section-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 1rem;
    }
    
    .items-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .item {
      display: flex;
      background-color: white;
      border-radius: 4px;
      padding: 1rem;
      gap: 1rem;
    }
    
    .item-image {
      width: 80px;
      height: 80px;
      flex-shrink: 0;
    }
    
    .item-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .item-details {
      flex-grow: 1;
    }
    
    .item-details h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1rem;
    }
    
    .item-details p {
      margin: 0 0 0.5rem 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .item-price {
      color: #555;
    }
    
    .item-total {
      font-weight: 500;
      display: flex;
      align-items: center;
      color: #333;
    }
    
    .address-details p, .payment-details p {
      margin: 0 0 0.5rem 0;
      color: #555;
    }
    
    .order-summary {
      background-color: white;
      border-radius: 4px;
      padding: 1.2rem;
    }
    
    .summary-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.8rem;
      color: #555;
    }
    
    .summary-row.total {
      font-weight: bold;
      color: #333;
      font-size: 1.1rem;
      margin-top: 1rem;
      padding-top: 1rem;
      border-top: 1px solid #eee;
    }
    
    .note {
      margin-top: 1rem;
      color: #777;
      font-size: 0.85rem;
    }
    
    .timeline {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    
    .timeline-entry {
      display: flex;
      gap: 1rem;
      background-color: white;
      border-radius: 4px;
      padding: 1rem;
    }
    
    .timeline-date {
      min-width: 120px;
      color: #777;
      font-size: 0.9rem;
    }
    
    .order-actions {
      display: flex;
      justify-content: space-between;
      margin-top: 2rem;
    }
    
    .back-btn, .update-btn {
      padding: 0.8rem 1.5rem;
      border-radius: 4px;
      font-weight: 500;
      text-decoration: none;
      cursor: pointer;
    }
    
    .back-btn {
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
    }
    
    .update-btn {
      background-color: #3498db;
      color: white;
      border: none;
    }
    
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 4rem 0;
    }
    
    .spinner {
      border: 4px solid rgba(0, 0, 0, 0.1);
      border-radius: 50%;
      border-top: 4px solid #3498db;
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
      .order-detail-card {
        padding: 1.5rem;
      }
      
      .order-header {
        flex-direction: column;
      }
      
      .order-status {
        margin-top: 1rem;
      }
      
      .item {
        flex-direction: column;
      }
      
      .item-image {
        width: 100%;
        height: auto;
        aspect-ratio: 1/1;
      }
      
      .item-total {
        align-self: flex-end;
      }
    }
  `]
})
export class SellerOrderDetailComponent implements OnInit {
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
    this.orderService.getSellerOrderDetail(orderId).subscribe({
      next: (order) => {
        this.order = order;
      },
      error: (error) => {
        console.error('Error loading seller order details:', error);
        this.error = 'Could not load order details. Please try again later.';
      }
    });
  }
  
  calculateSubtotal(): number {
    if (!this.order || !this.order.lineItems) return 0;
    
    return this.order.lineItems.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
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
  
  canUpdateStatus(): boolean {
    if (!this.order || !this.order.fulfillmentStatus) return false;
    
    // Allow status update only if the order is not cancelled
    return !this.order.isCancelled;
  }
} 