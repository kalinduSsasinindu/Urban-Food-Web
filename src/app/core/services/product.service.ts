import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { 
  Product, 
  ProductSearchResponse, 
  ProductVariant, 
  VariantOption, 
  MediaServiceDto 
} from '../models/product.model';
import { ApiService } from './api.service';
import { environment } from '../../utils/config';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.baseAPIUrl}Product`;

  constructor(private apiService: ApiService) {}

  // Get all products
  getProducts(): Observable<ProductSearchResponse[]> {
    return this.apiService.get<ProductSearchResponse[]>(this.apiUrl);
  }

  // Get product by ID
  getProductById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`${this.apiUrl}/${id}`);
  }

  // Create a new product
  createProduct(product: Product): Observable<string> {
    return this.apiService.post<any>(this.apiUrl, product).pipe(
      map(response => response.id),
      catchError(error => {
        console.error('Error creating product:', error);
        return throwError(() => new Error('Failed to create product'));
      })
    );
  }

  // Update a product
  updateProduct(product: Product): Observable<boolean> {
    return this.apiService.put(`${this.apiUrl}`, product).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating product:', error);
        return throwError(() => new Error('Failed to update product'));
      })
    );
  }

  // Update product options
  updateProductOptions(id: string, options: VariantOption[]): Observable<ProductVariant[]> {
    return this.apiService.patch<ProductVariant[]>(`${this.apiUrl}/${id}/Options`, options);
  }

  // Update product variants
  updateProductVariants(id: string, variants: ProductVariant[]): Observable<boolean> {
    return this.apiService.patch(`${this.apiUrl}/${id}/Variants`, variants).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating product variants:', error);
        return throwError(() => new Error('Failed to update product variants'));
      })
    );
  }

  // Generate product variants
  generateVariants(options: VariantOption[]): Observable<ProductVariant[]> {
    return this.apiService.post<ProductVariant[]>(`${this.apiUrl}/GenerateVariants`, options);
  }

  // Update product title and description
  updateTitleDescription(id: string, title: string, description: string): Observable<boolean> {
    return this.apiService.patch(
      `${this.apiUrl}/${id}/titledescription?title=${encodeURIComponent(title)}&description=${encodeURIComponent(description)}`, 
      null
    ).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating title and description:', error);
        return throwError(() => new Error('Failed to update title and description'));
      })
    );
  }

  // Delete a product
  deleteProduct(id: string): Observable<boolean> {
    return this.apiService.delete(`${this.apiUrl}/${id}`).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error deleting product:', error);
        return throwError(() => new Error('Failed to delete product'));
      })
    );
  }

  // Search products
  searchProducts(query?: string): Observable<ProductSearchResponse[]> {
    let url = `${this.apiUrl}/product`;
    if (query) {
      url += `?query=${encodeURIComponent(query)}`;
    }
    return this.apiService.get<ProductSearchResponse[]>(url);
  }

  // Update product media
  updateProductMedia(mediaDto: MediaServiceDto): Observable<boolean> {
    return this.apiService.put(`${this.apiUrl}/media`, mediaDto).pipe(
      map(() => true),
      catchError(error => {
        console.error('Error updating product media:', error);
        return throwError(() => new Error('Failed to update product media'));
      })
    );
  }

  // Add tags to a product
  addTagToProduct(productId: string, tagNames: string[]): Observable<any> {
    return this.apiService.post(`${this.apiUrl}/${productId}/add-tag`, tagNames);
  }
} 