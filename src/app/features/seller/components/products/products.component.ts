import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="products-container">
      <h2>Products Management</h2>
      <p>Manage your products here</p>
    </div>
  `,
  styles: [`
    .products-container {
      padding: 1rem;
    }
  `]
})
export class ProductsComponent {} 