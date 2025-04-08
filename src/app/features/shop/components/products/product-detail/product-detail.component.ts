import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent {
  selectedImageIndex = 0;
  productImages = [
    'https://ae01.alicdn.com/kf/S661f3b6c7fa24798b56a726f4ffd0fddp/V8-New-Mini-Drone-4k-profession-HD-1080P-Wide-Angle-Camera-WiFi-FPV-RC-Dron-Height.jpg_Q90.jpg',
    'https://ae01.alicdn.com/kf/S30f4e0adecdf43efb67e84ec4725de9fa/V8-New-Mini-Drone-4k-profession-HD-1080P-Wide-Angle-Camera-WiFi-FPV-RC-Dron-Height.jpg_Q90.jpg',
    'https://ae01.alicdn.com/kf/Seccb32238fc84517baf316cc1fdf13c8M/V8-New-Mini-Drone-4k-profession-HD-1080P-Wide-Angle-Camera-WiFi-FPV-RC-Dron-Height.jpg_Q90.jpg'
  ];

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  decreaseQuantity(): void {
    // Functionality for the - button
  }

  increaseQuantity(): void {
    // Functionality for the + button
  }

  addToCart(): void {
    // Add to cart functionality
  }

  buyNow(): void {
    // Buy now functionality
  }
} 