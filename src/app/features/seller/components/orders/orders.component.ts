import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { OrderService } from '../../../../core/services/order.service';
import { OrderSearchResponse } from '../../../../core/models/order.model';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="orders-container">
      <h1>Order Management</h1>
      
      <div class="orders-content" *ngIf="!loading; else loadingTemplate">
        <div class="orders-list" *ngIf="orders && orders.length > 0; else noOrders">
          <div class="order-card" *ngFor="let order of orders">
            <div class="order-header">
              <div class="order-id">
                <h3>Order #{{ order.orderNumber || order.id }}</h3>
                <span class="order-date">{{ order.orderDate | date:'medium' }}</span>
              </div>
              <div class="order-status">
                <span class="status-badge" [ngClass]="getStatusClass(order.orderStatus)">
                  {{ order.orderStatus }}
                </span>
              </div>
            </div>
            
            <div class="order-details">
              <div class="detail">
                <span class="label">Payment Status:</span>
                <span class="value">{{ order.paymentStatus }}</span>
              </div>
              <div class="detail">
                <span class="label">Fulfillment Status:</span>
                <span class="value">{{ order.fulfillmentStatus }}</span>
              </div>
              <div class="detail">
                <span class="label">Total:</span>
                <span class="value">LKR{{ order.total.toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="order-actions">
              <a [routerLink]="['/seller/orders', order.id]" class="btn-view-details">View Details</a>
            </div>
          </div>
        </div>
        
        <ng-template #noOrders>
          <div class="no-orders">
            <i class="fas fa-box-open"></i>
            <h2>No Orders Found</h2>
            <p>You don't have any orders containing your products yet.</p>
          </div>
        </ng-template>
      </div>
      
      <ng-template #loadingTemplate>
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .orders-container {
      max-width: 1000px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
    
    h1 {
      font-size: 1.8rem;
      color: #333;
      margin-bottom: 2rem;
    }
    
    .order-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    
    .order-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 1.2rem;
    }
    
    .order-id h3 {
      margin: 0 0 0.5rem 0;
      font-size: 1.2rem;
      color: #333;
    }
    
    .order-date {
      color: #777;
      font-size: 0.9rem;
    }
    
    .status-badge {
      display: inline-block;
      padding: 0.3rem 0.8rem;
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
    
    .order-details {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 1.5rem;
    }
    
    .detail {
      display: flex;
      flex-direction: column;
    }
    
    .label {
      color: #777;
      font-size: 0.9rem;
      margin-bottom: 0.3rem;
    }
    
    .value {
      font-weight: 500;
      color: #333;
    }
    
    .order-actions {
      display: flex;
      justify-content: flex-end;
    }
    
    .btn-view-details {
      padding: 0.5rem 1rem;
      background-color: #f5f5f5;
      color: #333;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: background-color 0.3s;
    }
    
    .btn-view-details:hover {
      background-color: #e8e8e8;
    }
    
    .no-orders {
      text-align: center;
      padding: 3rem;
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .no-orders i {
      font-size: 3rem;
      color: #ccc;
      margin-bottom: 1rem;
    }
    
    .no-orders h2 {
      color: #333;
      margin-bottom: 1rem;
    }
    
    .no-orders p {
      color: #777;
      margin-bottom: 1.5rem;
    }
    
    .loading {
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
      width: 30px;
      height: 30px;
      animation: spin 1s linear infinite;
      margin-bottom: 1rem;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  `]
})
export class OrdersComponent implements OnInit {
  orders: OrderSearchResponse[] = [];
  loading = true;
  error: string | null = null;
  
  constructor(private orderService: OrderService) {}
  
  ngOnInit(): void {
    this.loadOrders();
  }
  
  loadOrders(): void {
    this.loading = true;
    this.orderService.getSellerOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading seller orders:', error);
        this.error = 'Failed to load your orders. Please try again later.';
        this.loading = false;
      }
    });
  }
  
  getStatusClass(status: string): string {
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
} 