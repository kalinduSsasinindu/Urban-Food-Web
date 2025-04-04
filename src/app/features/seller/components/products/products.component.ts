import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../core/services/product.service';
import { ProductSearchResponse } from '../../../../core/models/product.model';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="products-container">
      <div class="header-section">
        <h2>Products Management</h2>
        <button class="add-product-btn" (click)="onAddProduct()">+ Add Product</button>
      </div>
      
      <div class="search-section">
        <input 
          type="text" 
          [(ngModel)]="searchQuery" 
          (keyup.enter)="searchProducts()"
          placeholder="Search products..."
          class="search-input"
        >
        <button class="search-btn" (click)="searchProducts()">Search</button>
      </div>
      
      <div class="products-list" *ngIf="products.length > 0; else noProducts">
        <table class="products-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Tags</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let product of products">
              <td class="image-cell">
                <img [src]="getProductImageUrl(product)" [alt]="product.title" class="product-thumbnail">
              </td>
              <td>{{ product.title }}</td>
              <td class="tags-cell">
                <div class="tag-list">
                  <span *ngFor="let tag of product.tags" class="tag">{{ tag }}</span>
                </div>
              </td>
              <td class="action-cell">
                <button class="edit-btn" (click)="onEditProduct(product.id)">Edit</button>
                <button class="delete-btn" (click)="onDeleteProduct(product.id)">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <ng-template #noProducts>
        <div class="no-products">
          <p>You don't have any products yet.</p>
          <button class="add-product-btn" (click)="onAddProduct()">Add your first product</button>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .products-container {
      padding: 1.5rem;
    }
    
    .header-section {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    h2 {
      margin: 0;
      font-size: 1.5rem;
      color: #333;
    }
    
    .add-product-btn {
      background-color: #ff4747;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.9rem;
      transition: all 0.2s ease;
    }
    
    .add-product-btn:hover {
      background-color: #e63e3e;
    }
    
    .search-section {
      display: flex;
      margin-bottom: 1.5rem;
    }
    
    .search-input {
      flex-grow: 1;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
      font-size: 0.9rem;
    }
    
    .search-btn {
      background-color: #ff4747;
      color: white;
      border: none;
      padding: 0.5rem 1rem;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
      transition: all 0.2s ease;
    }
    
    .search-btn:hover {
      background-color: #e63e3e;
    }
    
    .products-table {
      width: 100%;
      border-collapse: collapse;
    }
    
    .products-table th, 
    .products-table td {
      padding: 0.75rem;
      text-align: left;
      border-bottom: 1px solid #ddd;
    }
    
    .products-table th {
      background-color: #f2f2f2;
      font-weight: bold;
    }
    
    .image-cell {
      width: 80px;
    }
    
    .product-thumbnail {
      width: 60px;
      height: 60px;
      object-fit: cover;
      border-radius: 4px;
    }
    
    .tags-cell {
      max-width: 200px;
    }
    
    .tag-list {
      display: flex;
      flex-wrap: wrap;
      gap: 0.3rem;
    }
    
    .tag {
      background-color: #f0f0f0;
      color: #666;
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 12px;
      white-space: nowrap;
    }
    
    .action-cell {
      width: 150px;
      text-align: center;
    }
    
    .edit-btn, .delete-btn {
      padding: 0.3rem 0.7rem;
      margin: 0 0.2rem;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.8rem;
      transition: all 0.2s ease;
    }
    
    .edit-btn {
      background-color: #4a90e2;
      color: white;
      transition: all 0.2s ease;
    }
    
    .edit-btn:hover {
      background-color: #3a7bc8;
    }
    
    .delete-btn {
      background-color: #f44336;
      color: white;
    }
    
    .delete-btn:hover {
      background-color: #d32f2f;
    }
    
    .no-products {
      text-align: center;
      padding: 2rem;
      background-color: #f9f9f9;
      border-radius: 4px;
    }
    
    .no-products p {
      margin-bottom: 1rem;
      color: #666;
    }
  `]
})
export class ProductsComponent implements OnInit {
  products: ProductSearchResponse[] = [];
  searchQuery: string = '';
  
  constructor(
    private productService: ProductService,
    private router: Router
  ) {}
  
  ngOnInit() {
    this.loadProducts();
  }
  
  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        console.log('Products loaded:', this.products);
      },
      error: (error) => {
        console.error('Error loading products:', error);
      }
    });
  }
  
  searchProducts() {
    this.productService.searchProducts(this.searchQuery).subscribe({
      next: (data) => {
        this.products = data;
      },
      error: (error) => {
        console.error('Error searching products:', error);
      }
    });
  }
  
  getProductImageUrl(product: ProductSearchResponse): string {
    return product.imgUrl && product.imgUrl.length > 0 
      ? product.imgUrl[0] 
      : 'assets/placeholder-image.jpg';
  }
  
  onAddProduct() {
    this.router.navigate(['/seller/products/add']);
  }
  
  onEditProduct(productId?: string) {
    if (!productId) return;
    console.log('Edit product clicked:', productId);
    this.router.navigate(['/seller/products/edit', productId]);
  }
  
  onDeleteProduct(productId?: string) {
    if (!productId) return;
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(productId).subscribe({
        next: () => {
          this.loadProducts(); // Reload products after deletion
        },
        error: (error) => {
          console.error('Error deleting product:', error);
        }
      });
    }
  }
} 