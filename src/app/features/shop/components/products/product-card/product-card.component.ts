import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductSearchResponse } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: ProductSearchResponse;
  
  constructor(private router: Router) {}
  
  viewProductDetails() {
    console.log('ProductCard: Navigating to product detail with ID:', this.product.id);
    
    // Use simple window.open with a constructed URL
    const baseUrl = window.location.origin; // Gets the base URL like http://localhost:4200
    const productUrl = `${baseUrl}/shop/product/${this.product.id}`;
    
    console.log('Opening URL:', productUrl);
    window.open(productUrl, '_blank');
  }
  
  addToCart(event: Event) {
    // Prevent the click event from bubbling up to parent elements
    event.stopPropagation();
    
    console.log('Adding product to cart:', this.product.id);
    // TODO: Implement actual cart functionality
    
    // Show a temporary success message
    alert('Product added to cart!');
  }
} 