import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ProductSearchResponse, ProductVariant } from '../../../../../core/models/product.model';
import { CartService } from '../../../../../core/services/cart.service';
import { ProductService } from '../../../../../core/services/product.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: ProductSearchResponse;
  
  constructor(
    private router: Router,
    private cartService: CartService,
    private productService: ProductService
  ) {}
  
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
    
    // Get the full product details to access variants
    this.productService.getProductById(this.product.id).subscribe({
      next: (fullProduct) => {
        if (fullProduct.variants && fullProduct.variants.length > 0) {
          // Use the first variant by default
          const defaultVariant = fullProduct.variants[0];
          // Add to cart with quantity 1
          this.cartService.addToCart(fullProduct, defaultVariant, 1);
          
          // Show a success message
          alert('Product added to cart!');
        } else {
          alert('Sorry, this product is not available at the moment.');
        }
      },
      error: (error) => {
        console.error('Error fetching product details:', error);
        alert('Error adding product to cart. Please try again.');
      }
    });
  }
} 