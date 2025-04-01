import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { 
  Product, 
  ProductSearchResponse, 
  ProductVariant, 
  VariantOption
} from '../models/product.model';
import { Tag } from '../models/tag.model';

@Injectable({
  providedIn: 'root'
})
export class MockProductService {
  private mockProducts: ProductSearchResponse[] = [
    {
      id: '3',
      title: 'Organic Avocados',
      description: 'Perfectly ripened organic avocados from California, rich and creamy texture perfect for guacamole or toast',
      price: 4.99,
      imgUrl: 'https://images.unsplash.com/photo-1519162808019-7de1683fa2ad?q=80&w=1000',
      tags: ['Produce', 'Organic', 'Healthy']
    },
    {
      id: '4',
      title: 'Fresh Berry Mix',
      description: 'Assortment of fresh seasonal berries including strawberries, blueberries, and raspberries, perfect for smoothies or desserts',
      price: 6.99,
      imgUrl: 'https://images.unsplash.com/photo-1577069861033-55d04cec4ef5?q=80&w=1000',
      tags: ['Produce', 'Fresh', 'Seasonal']
    },
    {
      id: '5',
      title: 'Extra Virgin Olive Oil',
      description: 'Cold-pressed extra virgin olive oil from Italian olives, rich flavor with peppery finish, perfect for dressing and cooking',
      price: 12.99,
      imgUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?q=80&w=1000',
      tags: ['Pantry', 'Imported', 'Premium']
    },
    {
      id: '6',
      title: 'Artisan Cheese Selection',
      description: 'Curated selection of artisanal cheeses from local dairies, includes soft, semi-soft, and aged varieties',
      price: 24.99,
      imgUrl: 'https://images.unsplash.com/photo-1452195100486-9cc805987862?q=80&w=1000',
      tags: ['Dairy', 'Artisan', 'Local']
    },
    {
      id: '7',
      title: 'Organic Wild Honey',
      description: 'Raw, unfiltered wildflower honey from sustainable apiaries, rich and complex flavor profile',
      price: 9.99,
      imgUrl: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=1000',
      tags: ['Pantry', 'Organic', 'Natural']
    },
    {
      id: '8',
      title: 'Premium Sushi Grade Salmon',
      description: 'Fresh, sustainably sourced salmon fillets suitable for sashimi, sushi, or cooking, rich in omega-3 fatty acids',
      price: 18.99,
      imgUrl: 'https://images.unsplash.com/photo-1559548331-f9cb98001426?q=80&w=1000',
      tags: ['Seafood', 'Fresh', 'Premium']
    }
  ];

  private mockFullProducts: Product[] = this.mockProducts.map(p => ({
    id: p.id,
    title: p.title,
    description: p.description,
    imgUrls: [p.imgUrl],
    images: [p.imgUrl],
    tags: p.tags,
    variants: [
      {
        variantId: 1,
        sku: `SKU-${p.id}-1`,
        name: `${p.title} - Standard`,
        price: p.price,
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
    ]
  }));

  private mockTags: Tag[] = [
    { id: '1', name: 'Organic', kind: 'product' },
    { id: '2', name: 'Fresh', kind: 'product' },
    { id: '3', name: 'Premium', kind: 'product' },
    { id: '4', name: 'Local', kind: 'product' },
    { id: '5', name: 'Healthy', kind: 'product' },
    { id: '6', name: 'Seasonal', kind: 'product' },
    { id: '7', name: 'Imported', kind: 'product' },
    { id: '8', name: 'Pantry', kind: 'product' },
    { id: '9', name: 'Dairy', kind: 'product' },
    { id: '10', name: 'Produce', kind: 'product' },
    { id: '11', name: 'Seafood', kind: 'product' }
  ];

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

  createProduct(product: Product): Observable<Product> {
    const newProduct = {
      ...product,
      id: `new-${Date.now()}`
    };
    return of(newProduct);
  }

  updateProduct(product: Product): Observable<Product> {
    return of(product);
  }

  deleteProduct(id: string): Observable<any> {
    return of({ success: true });
  }

  // Variant operations
  addVariant(productId: string, variant: ProductVariant): Observable<ProductVariant> {
    return of(variant);
  }

  updateVariant(productId: string, variant: ProductVariant): Observable<ProductVariant> {
    return of(variant);
  }

  deleteVariant(productId: string, variantId: number): Observable<any> {
    return of({ success: true });
  }

  // Options operations
  addOption(productId: string, option: VariantOption): Observable<VariantOption> {
    return of(option);
  }

  updateOption(productId: string, optionName: string, option: VariantOption): Observable<VariantOption> {
    return of(option);
  }

  deleteOption(productId: string, optionName: string): Observable<any> {
    return of({ success: true });
  }

  // Media operations
  uploadMedia(productId: string, media: File[]): Observable<any[]> {
    return of(media.map((file, index) => ({
      id: `media-${index}`,
      url: URL.createObjectURL(file),
      fileName: file.name,
      fileType: file.type,
      size: file.size
    })));
  }

  deleteMedia(productId: string, mediaId: string): Observable<any> {
    return of({ success: true });
  }

  // Generate variants from options
  generateVariants(options: VariantOption[]): ProductVariant[] {
    if (!options || options.length === 0) {
      return [];
    }

    // Create combinations of option values
    const combinations = this.generateCombinations(options);
    
    // Generate variants from combinations
    return combinations.map((combo, index) => {
      const variantName = combo.join(' / ');
      return {
        variantId: index,
        sku: `GEN-SKU-${index}`,
        name: variantName,
        price: 0,
        availableQuantity: 0,
        committedQuantity: 0,
        isActive: true
      };
    });
  }

  // Helper to generate all combinations of option values
  private generateCombinations(options: VariantOption[]): string[][] {
    // Base case: if there are no options, return an empty combination
    if (options.length === 0) {
      return [[]];
    }

    // Take the first option
    const firstOption = options[0];
    // Generate combinations for the rest of the options
    const restCombinations = this.generateCombinations(options.slice(1));

    // For each value of the first option, combine with each combination of the rest
    const result: string[][] = [];
    firstOption.values.forEach(value => {
      restCombinations.forEach(combo => {
        result.push([value, ...combo]);
      });
    });

    return result;
  }

  // Tag operations
  searchTags(kind: string): Observable<Tag[]> {
    return of(this.mockTags.filter(tag => tag.kind === kind));
  }

  addTagToProduct(productId: string, tagId: string): Observable<any> {
    return of({ success: true });
  }

  removeTagFromProduct(productId: string, tagId: string): Observable<any> {
    return of({ success: true });
  }
} 