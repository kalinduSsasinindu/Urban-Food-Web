import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  template: `
    <div class="landing-container">
      <div class="landing-header">
        <h1>Discover Delicious Food</h1>
        <p>Order from the best local restaurants</p>
      </div>
      <div class="products-grid">
        @for (product of products; track product.id) {
          <app-product-card [product]="product"></app-product-card>
        }
      </div>
    </div>
  `,
  styles: [`
    .landing-container {
      padding: 2rem;
      background: white;
      min-height: calc(100vh - 64px);
    }

    .landing-header {
      text-align: center;
      margin-bottom: 2rem;
    }

    .landing-header h1 {
      font-size: 2rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .landing-header p {
      font-size: 1.1rem;
      color: #34495e;
    }

    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1.5rem;
      max-width: 1200px;
      margin: 0 auto;
      justify-items: center;
    }
  `]
})
export class LandingComponent implements OnInit {
  products: Product[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      products => this.products = products
    );
  }
} 