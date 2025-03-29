import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="orders-container">
      <h2>Orders Management</h2>
      <p>View and manage your orders here</p>
    </div>
  `,
  styles: [`
    .orders-container {
      padding: 1rem;
    }
  `]
})
export class OrdersComponent {} 