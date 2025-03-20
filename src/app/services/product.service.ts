import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private mockProducts: Product[] = [
    {
      id: 1,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato sauce, mozzarella, and fresh basil',
      price: 12.99,
      imageUrl: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca',
      category: 'Pizza',
      rating: 4.5,
      restaurant: 'Pizza Palace'
    },
    {
      id: 2,
      name: 'Chicken Burger',
      description: 'Grilled chicken breast with lettuce, tomato, and special sauce',
      price: 9.99,
      imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
      category: 'Burgers',
      rating: 4.3,
      restaurant: 'Burger House'
    },
    {
      id: 3,
      name: 'Pad Thai',
      description: 'Rice noodles with tofu, shrimp, peanuts, and tamarind sauce',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1559314809-0d155014e29e',
      category: 'Thai',
      rating: 4.7,
      restaurant: 'Thai Delight'
    },
    {
      id: 4,
      name: 'Caesar Salad',
      description: 'Fresh romaine lettuce with parmesan, croutons, and Caesar dressing',
      price: 8.99,
      imageUrl: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
      category: 'Salads',
      rating: 4.2,
      restaurant: 'Green Bowl'
    },
    {
      id: 5,
      name: 'Sushi Roll Combo',
      description: 'Assorted fresh sushi rolls with wasabi and pickled ginger',
      price: 24.99,
      imageUrl: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
      category: 'Japanese',
      rating: 4.8,
      restaurant: 'Sushi Master'
    },
    {
      id: 6,
      name: 'Beef Burrito',
      description: 'Large burrito with seasoned beef, rice, beans, and fresh salsa',
      price: 11.99,
      imageUrl: 'https://images.unsplash.com/photo-1552332386-f8dd00dc2f85',
      category: 'Mexican',
      rating: 4.4,
      restaurant: 'Taco Fiesta'
    },
    {
      id: 7,
      name: 'Chicken Tikka Masala',
      description: 'Tender chicken in creamy tomato curry sauce with basmati rice',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641',
      category: 'Indian',
      rating: 4.6,
      restaurant: 'Spice Garden'
    },
    {
      id: 8,
      name: 'Greek Gyros',
      description: 'Seasoned lamb with tzatziki sauce and fresh vegetables in pita',
      price: 10.99,
      imageUrl: 'https://images.unsplash.com/photo-1583207884889-d81cbc3b1448',
      category: 'Mediterranean',
      rating: 4.5,
      restaurant: 'Mediterranean Grill'
    },
    {
      id: 9,
      name: 'Pho Noodle Soup',
      description: 'Vietnamese beef noodle soup with herbs and bean sprouts',
      price: 13.99,
      imageUrl: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43',
      category: 'Vietnamese',
      rating: 4.7,
      restaurant: 'Pho Delicious'
    },
    {
      id: 10,
      name: 'BBQ Ribs',
      description: 'Slow-cooked pork ribs with homemade BBQ sauce and coleslaw',
      price: 19.99,
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947',
      category: 'BBQ',
      rating: 4.6,
      restaurant: 'Smokehouse BBQ'
    },
    {
      id: 11,
      name: 'Seafood Paella',
      description: 'Spanish rice dish with mixed seafood, saffron, and vegetables',
      price: 26.99,
      imageUrl: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a',
      category: 'Spanish',
      rating: 4.8,
      restaurant: 'Barcelona Bistro'
    },
    {
      id: 12,
      name: 'Mushroom Risotto',
      description: 'Creamy Italian rice with wild mushrooms and parmesan',
      price: 16.99,
      imageUrl: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371',
      category: 'Italian',
      rating: 4.5,
      restaurant: 'Pasta Paradise'
    },
    {
      id: 13,
      name: 'Korean BBQ Bowl',
      description: 'Grilled bulgogi beef with rice, kimchi, and vegetables',
      price: 14.99,
      imageUrl: 'https://images.unsplash.com/photo-1590301157890-4810ed352733',
      category: 'Korean',
      rating: 4.6,
      restaurant: 'Seoul Kitchen'
    },
    {
      id: 14,
      name: 'Fish and Chips',
      description: 'Beer-battered cod with crispy fries and tartar sauce',
      price: 15.99,
      imageUrl: 'https://images.unsplash.com/photo-1579208575657-c595a05383b7',
      category: 'British',
      rating: 4.4,
      restaurant: 'London Pub'
    }
  ];

  getProducts(): Observable<Product[]> {
    return of(this.mockProducts);
  }

  getProductById(id: number): Observable<Product | undefined> {
    return of(this.mockProducts.find(product => product.id === id));
  }

  searchProducts(query: string): Observable<Product[]> {
    const lowercaseQuery = query.toLowerCase();
    return of(
      this.mockProducts.filter(product =>
        product.name.toLowerCase().includes(lowercaseQuery) ||
        product.description.toLowerCase().includes(lowercaseQuery) ||
        product.category.toLowerCase().includes(lowercaseQuery) ||
        product.restaurant.toLowerCase().includes(lowercaseQuery)
      )
    );
  }
} 