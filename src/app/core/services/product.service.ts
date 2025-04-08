import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, throwError, of } from 'rxjs';
import { 
  Product, 
  ProductSearchResponse, 
  ProductVariant, 
  VariantOption, 
  MediaServiceDto, 
  ProductType
} from '../models/product.model';
import { ApiService } from './api.service';
import { environment } from '../../utils/config';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = `${environment.baseAPIUrl}Product`;
  private tagsUrl = `${environment.baseAPIUrl}Tags`;

  constructor(private apiService: ApiService, private http: HttpClient) {}

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

  // Add a new product - alternative name for createProduct
  addProduct(product: Product): Observable<string> {
    return this.createProduct(product);
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
    if (!options || options.length === 0) {
      return of([]);
    }

    // Generate all possible combinations of option values
    const generateCombinations = (options: any[], currentIndex: number, currentCombination: any[], combinations: any[]) => {
      if (currentIndex === options.length) {
        combinations.push([...currentCombination]);
        return;
      }

      const currentOption = options[currentIndex];
      for (const value of currentOption.values) {
        currentCombination.push({ option: currentOption.name, value });
        generateCombinations(options, currentIndex + 1, currentCombination, combinations);
        currentCombination.pop();
      }
    };

    const combinations: any[] = [];
    generateCombinations(options, 0, [], combinations);

    // Create variants from the combinations
    const variants: ProductVariant[] = combinations.map((combination, index) => {
      const name = combination.map((c: any) => c.value).join(' / ');
      return {
        name,
        price: 0,
        variantId: index,
        sku: `GEN-SKU-${index}`,
        isActive: true,
        availableQuantity: 0,
        committedQuantity: 0
      };
    });

    return of(variants);
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

  // Tag related methods
  searchTags(kind: string): Observable<Tag[]> {
    return this.apiService.get<Tag[]>(`${this.tagsUrl}/kind/${kind}`).pipe(
      catchError((error: any) => {
        console.error('Error fetching tags:', error);
        return of([]);
      })
    );
  }

  addTagToProduct(productId: string, tags: string[]): Observable<any> {
    return this.apiService.put(`${this.apiUrl}/${productId}/tags`, { tags });
  }

  getProductsByProductType(productType?: ProductType): Observable<Product[]> {
    let url = `${this.apiUrl}/customergetproductsbyproducttype`;
    const params: { [key: string]: string } = {};
    if (productType !== undefined) {
      params['productType'] = productType.toString();
    }
    return this.apiService.get<Product[]>(url, params);
  }

  // Get product details by ID without client filtering
  getProductDetailsById(id: string): Observable<Product> {
    return this.apiService.get<Product>(`${this.apiUrl}/customergetproductdetailsbyid/${id}`);
  }
} 