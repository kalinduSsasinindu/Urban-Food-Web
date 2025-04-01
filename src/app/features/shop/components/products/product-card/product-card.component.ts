import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchResponse } from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.css']
})
export class ProductCardComponent {
  @Input() product!: ProductSearchResponse;
} 