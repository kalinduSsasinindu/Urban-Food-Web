import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../../../core/services/product.service';
import { CartService } from '../../../../../core/services/cart.service';
import { AuthService } from '../../../../../core/auth/auth.service';
import { 
  Product, 
  ProductType, 
  ProductReview, 
  CreateProductReviewDto 
} from '../../../../../core/models/product.model';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  selectedImageIndex = 0;
  productId: string | null = null;
  product: Product | null = null;
  reviews: ProductReview[] = [];
  loading = true;
  loadingReviews = false;
  error = false;
  quantity = 1;
  ProductType = ProductType; // Make enum available to template
  
  // New fields for review functionality
  newReview = {
    rating: 5,
    comment: '',
    reviewImages: [] as string[]
  };
  showReviewForm = false;
  reviewSubmitting = false;
  reviewError = '';
  ratingDistribution: { [key: number]: number } = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0
  };
  selectedRatingFilter: number | null = null;
  filteredReviews: ProductReview[] = [];
  currentUserId: string = '';

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Get current user ID for highlighting user's reviews
    this.currentUserId = this.authService.getClientIdFromLocalStorage();
    
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id');
      if (this.productId) {
        this.loadProductDetails(this.productId);
      }
    });
  }

  // Check if a review belongs to the current user
  isCurrentUserReview(review: ProductReview): boolean {
    return !!this.currentUserId && !!review.reviewerId && review.reviewerId === this.currentUserId;
  }

  loadProductDetails(id: string): void {
    this.loading = true;
    this.error = false;
    
    this.productService.getProductDetailsById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loading = false;
        console.log('Product details loaded:', product);
        
        // Load reviews after product is loaded
        this.loadProductReviews(id);
      },
      error: (err: any) => {
        console.error('Error loading product details:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  loadProductReviews(productId: string): void {
    this.loadingReviews = true;
    
    // Using the new method to get all reviews without user filtering
    this.productService.getAllProductReviews(productId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        
        // Sort reviews: Current user's reviews first, then by date descending
        this.sortReviews();
        
        this.filteredReviews = [...this.reviews];
        this.loadingReviews = false;
        
        // Calculate rating distribution
        this.calculateRatingDistribution();
        
        console.log('Product reviews loaded:', reviews);
      },
      error: (err) => {
        console.error('Error loading product reviews:', err);
        this.loadingReviews = false;
      }
    });
  }

  // Sort reviews to show current user's reviews at the top
  sortReviews(): void {
    this.reviews.sort((a, b) => {
      // Current user's reviews first
      const aIsCurrentUser = this.isCurrentUserReview(a);
      const bIsCurrentUser = this.isCurrentUserReview(b);
      
      if (aIsCurrentUser && !bIsCurrentUser) return -1;
      if (!aIsCurrentUser && bIsCurrentUser) return 1;
      
      // Then sort by date (newest first)
      const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bDate - aDate;
    });
  }

  calculateRatingDistribution(): void {
    // Reset distribution
    this.ratingDistribution = {
      1: 0, 2: 0, 3: 0, 4: 0, 5: 0
    };
    
    // Count reviews by rating
    this.reviews.forEach(review => {
      if (review.rating && review.rating >= 1 && review.rating <= 5) {
        this.ratingDistribution[review.rating]++;
      }
    });
  }

  filterReviewsByRating(rating: number | null): void {
    this.selectedRatingFilter = rating;
    
    if (rating === null) {
      this.filteredReviews = [...this.reviews];
    } else {
      this.filteredReviews = this.reviews.filter(review => review.rating === rating);
    }
  }

  submitReview(): void {
    if (!this.productId) return;
    
    this.reviewSubmitting = true;
    this.reviewError = '';
    
    this.productService.addProductReview(this.productId, this.newReview).subscribe({
      next: (review) => {
        console.log('Review submitted:', review);
        this.reviewSubmitting = false;
        this.showReviewForm = false;
        
        // Add the new review to the list
        this.reviews.unshift(review);
        
        // Resort to ensure proper ordering
        this.sortReviews();
        
        this.filteredReviews = [...this.reviews];
        this.calculateRatingDistribution();
        
        // Reset the form
        this.newReview = {
          rating: 5,
          comment: '',
          reviewImages: []
        };
      },
      error: (err) => {
        console.error('Error submitting review:', err);
        this.reviewSubmitting = false;
        this.reviewError = 'Failed to submit review. Please try again.';
      }
    });
  }

  likeReview(reviewId: string, event: Event): void {
    event.stopPropagation();
    
    if (!this.productId) return;
    
    this.productService.likeProductReview(this.productId, reviewId).subscribe({
      next: (newLikeCount) => {
        // Update the like count in the reviews list
        const review = this.reviews.find(r => r.id === reviewId);
        if (review) {
          review.likesCount = newLikeCount;
        }
      },
      error: (err) => {
        console.error('Error liking review:', err);
      }
    });
  }

  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      for (let i = 0; i < input.files.length; i++) {
        const file = input.files[i];
        const reader = new FileReader();
        
        reader.onload = () => {
          const base64String = reader.result as string;
          if (this.newReview.reviewImages) {
            this.newReview.reviewImages.push(base64String);
          } else {
            this.newReview.reviewImages = [base64String];
          }
        };
        
        reader.readAsDataURL(file);
      }
    }
  }

  removeUploadedImage(index: number): void {
    if (this.newReview.reviewImages) {
      this.newReview.reviewImages.splice(index, 1);
    }
  }

  getProductTypeName(productType: ProductType): string {
    switch(productType) {
      case ProductType.Fruit:
        return 'Fruit';
      case ProductType.Vegetable:
        return 'Vegetable';
      case ProductType.DairyProduct:
        return 'Dairy Product';
      case ProductType.BakedGood:
        return 'Baked Good';
      case ProductType.HandmadeCraft:
        return 'Handmade Craft';
      default:
        return 'Unknown';
    }
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    if (this.product && this.product.variants && this.product.variants.length > 0) {
      const selectedVariant = this.product.variants[0]; // Default to first variant, can be enhanced to select specific variants
      console.log('Adding to cart:', this.product.id, 'Quantity:', this.quantity);
      
      this.cartService.addToCart(this.product, selectedVariant, this.quantity);
      
      // Show feedback to the user
      alert(`Added ${this.quantity} item(s) to cart!`);
    }
  }

  buyNow(): void {
    this.addToCart();
    this.router.navigate(['/cart']);
  }

  // Helper method to format date
  formatDate(date: Date | string | undefined): string {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }
} 