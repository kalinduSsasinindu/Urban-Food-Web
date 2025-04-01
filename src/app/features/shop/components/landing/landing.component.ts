import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardComponent } from '../products/product-card/product-card.component';
import { MockProductService } from '../../../../core/services/mock-product.service';
import { ProductSearchResponse } from '../../../../core/models/product.model';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, ProductCardComponent],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  products: ProductSearchResponse[] = [];

  constructor(private productService: MockProductService) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(
      products => this.products = products
    );
  }
} 