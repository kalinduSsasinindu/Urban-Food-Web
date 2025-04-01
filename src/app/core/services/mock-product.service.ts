import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Product, 
  ProductSearchResponse, 
  ProductVariant, 
  VariantOption 
} from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class MockProductService {
  private mockProducts: ProductSearchResponse[] = [
    
    {
      id: '3',
      title: 'Organic Avocados',
      description: 'Perfectly ripened organic avocados from California, rich and creamy texture perfect for guacamole or toast',
      imgUrls: ['https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=1000'],
      tags: ['Produce', 'Organic', 'Healthy']
    },
    {
      id: '4',
      title: 'Fresh Berry Mix',
      description: 'Assortment of fresh seasonal berries including strawberries, blueberries, and raspberries, perfect for smoothies or desserts',
      imgUrls: ['https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?q=80&w=1000'],
      tags: ['Produce', 'Fresh', 'Seasonal']
    },
    {
      id: '5',
      title: 'Extra Virgin Olive Oil',
      description: 'Cold-pressed extra virgin olive oil from Italian olives, rich flavor with peppery finish, perfect for dressing and cooking',
      imgUrls: ['https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000'],
      tags: ['Pantry', 'Imported', 'Premium']
    },
    {
      id: '6',
      title: 'Artisan Cheese Selection',
      description: 'Curated selection of artisanal cheeses from local dairies, includes soft, semi-soft, and aged varieties',
      imgUrls: ['https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1000'],
      tags: ['Dairy', 'Artisan', 'Local']
    },
    {
      id: '7',
      title: 'Organic Wild Honey',
      description: 'Raw, unfiltered wildflower honey from sustainable apiaries, rich and complex flavor profile',
      imgUrls: ['https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1000'],
      tags: ['Pantry', 'Organic', 'Natural']
    },
    {
      id: '8',
      title: 'Premium Sushi Grade Salmon',
      description: 'Fresh, sustainably sourced salmon fillets suitable for sashimi, sushi, or cooking, rich in omega-3 fatty acids',
      imgUrls: ['https://images.unsplash.com/photo-1559548331-f9cb98001426?q=80&w=1000'],
      tags: ['Seafood', 'Fresh', 'Premium']
    }
  ];

  private mockFullProducts: Product[] = this.mockProducts.map(p => ({
    ...p,
    images: [],
    variants: [
      {
        variantId: 1,
        sku: `SKU-${p.id}-1`,
        name: `${p.title} - Standard`,
        price: 19.99,
        availableQuantity: 100,
        committedQuantity: 0,
        isActive: true
      }
    ],
    options: [
      {
        name: 'Size',
        values: ['Small', 'Medium', 'Large']
      }
    ],
    createdAt: new Date(),
    updatedAt: new Date()
  }));

  constructor() {}

  // Get all products
  getProducts(): Observable<ProductSearchResponse[]> {
    return of(this.mockProducts);
  }

  // Get product by ID
  getProductById(id: string): Observable<Product> {
    const product = this.mockFullProducts.find(p => p.id === id);
    return of(product || this.mockFullProducts[0]);
  }

  // Search products
  searchProducts(query?: string): Observable<ProductSearchResponse[]> {
    if (!query) {
      return of(this.mockProducts);
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filtered = this.mockProducts.filter(product => 
      product.title.toLowerCase().includes(lowercaseQuery) || 
      product.description.toLowerCase().includes(lowercaseQuery) ||
      product.tags?.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
    
    return of(filtered);
  }

  // The following methods are stubs - they don't actually change data
  // but return success responses for testing UI

  createProduct(product: Product): Observable<string> {
    return of('new-product-id');
  }

  updateProduct(product: Product): Observable<boolean> {
    return of(true);
  }

  updateProductOptions(id: string, options: VariantOption[]): Observable<ProductVariant[]> {
    return of([
      {
        variantId: 1,
        sku: `SKU-${id}-1`,
        name: 'Generated Variant 1',
        price: 19.99,
        availableQuantity: 100,
        committedQuantity: 0,
        isActive: true
      }
    ]);
  }

  updateProductVariants(id: string, variants: ProductVariant[]): Observable<boolean> {
    return of(true);
  }

  generateVariants(options: VariantOption[]): Observable<ProductVariant[]> {
    return of([
      {
        variantId: 1,
        sku: 'GENERATED-SKU-1',
        name: 'Generated Variant 1',
        price: 19.99,
        availableQuantity: 100,
        committedQuantity: 0,
        isActive: true
      }
    ]);
  }

  updateTitleDescription(id: string, title: string, description: string): Observable<boolean> {
    return of(true);
  }

  deleteProduct(id: string): Observable<boolean> {
    return of(true);
  }

  addTagToProduct(productId: string, tagNames: string[]): Observable<any> {
    return of({ success: true });
  }
} 