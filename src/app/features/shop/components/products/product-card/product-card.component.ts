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
    
    // Generate the URL for the product detail page
    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/shop/product', this.product.id])
    );
    
    // Open the URL in a new window/tab
    window.open(url, '_blank');
  }
} 