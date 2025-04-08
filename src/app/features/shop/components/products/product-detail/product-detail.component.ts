import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Product, ProductSearchResponse, ProductVariant } from '../../../../../core/models/product.model';
import { ProductService } from '../../../../../core/services/product.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, DecimalPipe],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  productInfo: ProductSearchResponse | null = null;
  isLoading = true;
  selectedImageIndex = 0;
  quantity = 1;
  selectedVariant: ProductVariant | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const productId = params.get('id');
      if (productId) {
        this.loadProduct(productId);
      }
    });
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.isLoading = false;

        // Get product search response data to access additional properties
        this.productService.getProducts().subscribe(products => {
          this.productInfo = products.find(p => p.id === id) || null;
        });

        if (data.variants && data.variants.length > 0) {
          this.selectedVariant = data.variants[0];
        }
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.isLoading = false;
      }
    });
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', {
      product: this.product,
      variant: this.selectedVariant,
      quantity: this.quantity
    });
  }

  buyNow(): void {
    // TODO: Implement buy now functionality
    this.addToCart();
    // Navigate to checkout
  }
} 