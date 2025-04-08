import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { ProductService } from '../../../../core/services/product.service';
import { Product, ProductSearchResponse, ProductType } from '../../../../core/models/product.model';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  products: ProductSearchResponse[] = [];

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const productType = params['productType'] ? +params['productType'] : undefined;
      this.loadProducts(productType);
    });
  }

  loadProducts(productType?: ProductType) {
    this.productService.getProductsByProductType(productType).subscribe({
      next: (fullProducts) => {
        // Map full Product objects to ProductSearchResponse format
        this.products = fullProducts.map(product => ({
          id: product.id,
          title: product.title,
          description: product.description,
          imgUrl: product.imgUrls?.[0] || '',
          price: product.variants[0]?.price || 0,
          tags: product.tags || []
        }));
        console.log('Loaded products:', this.products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
} 