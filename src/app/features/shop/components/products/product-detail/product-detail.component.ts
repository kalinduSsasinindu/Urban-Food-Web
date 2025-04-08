import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../../../core/services/product.service';
import { Product, ProductType } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  selectedImageIndex = 0;
  productId: string | null = null;
  product: Product | null = null;
  loading = true;
  error = false;
  quantity = 1;
  ProductType = ProductType; // Make enum available to template

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProductDetails(this.productId);
      }
    });
  }

  loadProductDetails(id: string): void {
    this.loading = true;
    this.error = false;
    
    this.productService.getProductDetailsById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loading = false;
        console.log('Product details loaded:', product);
      },
      error: (err: any) => {
        console.error('Error loading product details:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  getProductTypeName(productType: ProductType): string {
    switch(productType) {
      case ProductType.Fruit:
        return 'Fruit';
      case ProductType.Vegetable:
        return 'Vegetable';
      case ProductType.DairyProduct:
        return 'Dairy Product';
      case ProductType.BakedGood:
        return 'Baked Good';
      case ProductType.HandmadeCraft:
        return 'Handmade Craft';
      default:
        return 'Unknown';
    }
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
    if (this.product) {
      console.log('Adding to cart:', this.product.id, 'Quantity:', this.quantity);
      // TODO: Implement actual cart functionality
      alert(`Added ${this.quantity} item(s) to cart!`);
    }
  }

  buyNow(): void {
    if (this.product) {
      console.log('Buy now:', this.product.id, 'Quantity:', this.quantity);
      // TODO: Implement checkout functionality
      alert('Proceeding to checkout...');
    }
  }
} 