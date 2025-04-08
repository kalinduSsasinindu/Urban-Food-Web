import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { UserService } from '../../core/services';
import { ProductType, StoreDetails, User } from '../../core/models';
import { StoreDetailsModalComponent } from '../../shared/components/store-details-modal/store-details-modal.component';
import { CATEGORIES, Category } from '../../core/models/category.enum';
import { ProductService } from '../../core/services/product.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StoreDetailsModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  searchQuery: string = '';
  showModal: boolean = false;
  showAuthDropdown: boolean = false;
  showAuthModal: boolean = false;
  showUserDropdown: boolean = false;
  showImageSearchModal: boolean = false;
  showLanguageDropdown: boolean = false;
  selectedLanguage: string = 'English';
  currentUser: User | null = null;
  cartItemCount: number = 0;
  uploadedImageSrc: string | null = null;
  hasUploadedImage: boolean = false;
  isAuthDropdownActive: boolean = false;
  isUserDropdownActive: boolean = false;
  isLanguageDropdownActive: boolean = false;
  isCategoriesOpen: boolean = false;
  isProductTypeOpen: boolean = false;
  selectedProductTypeLabel: string = '';

  categories: Category[] = CATEGORIES;
  ProductType = ProductType;
  selectedProductType: ProductType | undefined;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    if (this.isLoggedIn) {
      this.loadUserProfile();
      this.loadCartItemCount();
    }
  }

  private loadUserProfile() {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
        console.log('Loaded user profile:', user);
        console.log('User role:', user.userRole);
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
      }
    });
  }

  private loadCartItemCount() {
    // TODO: Implement loading cart item count from service
    // For now, we'll use a dummy value
    this.cartItemCount = 3;
  }

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  onImageSearch() {
    // TODO: Implement image search functionality
    console.log('Image search clicked');
  }

  toggleImageSearch(event?: Event) {
    if (event) {
      event.stopPropagation(); // Prevent event bubbling
      event.preventDefault();
    }
    
    // Toggle modal state
    this.showImageSearchModal = !this.showImageSearchModal;
    
    // If opening modal, add class to prevent body scrolling
    if (this.showImageSearchModal) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    
    console.log('Image search modal toggled:', this.showImageSearchModal);
  }

  triggerFileInput() {
    this.fileInput.nativeElement.click();
  }

  handleFileUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Check if the file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Create a reader to read the file
      const reader = new FileReader();
      
      reader.onload = () => {
        console.log('Image loaded:', file.name);
        this.uploadedImageSrc = reader.result as string;
        this.hasUploadedImage = true;
        
        // Keep the modal open to show the uploaded image
        // this.showImageSearchModal = false;
        // this.searchQuery = 'Image search results';
        // this.onSearch();
      };
      
      reader.readAsDataURL(file);
    }
  }

  performImageSearch() {
    if (this.hasUploadedImage) {
      this.showImageSearchModal = false;
      this.searchQuery = 'Image search results';
      this.onSearch();
      // Reset the image state for next time
      setTimeout(() => {
        this.uploadedImageSrc = null;
        this.hasUploadedImage = false;
      }, 500);
    }
  }

  cancelImageUpload() {
    this.uploadedImageSrc = null;
    this.hasUploadedImage = false;
  }

  toggleLanguageDropdown(event: Event) {
    event.stopPropagation();
    this.showLanguageDropdown = !this.showLanguageDropdown;
    
    // Close other dropdowns
    this.showAuthDropdown = false;
    
    // Add click outside listener
    if (this.showLanguageDropdown) {
      setTimeout(() => {
        document.addEventListener('click', this.closeLanguageDropdown);
      }, 0);
    }
  }
  
  closeLanguageDropdown = () => {
    this.showLanguageDropdown = false;
    document.removeEventListener('click', this.closeLanguageDropdown);
  }
  
  selectLanguage(language: string, event: Event) {
    event.stopPropagation();
    this.selectedLanguage = language;
    this.showLanguageDropdown = false;
    this.isLanguageDropdownActive = false;
    document.removeEventListener('click', this.closeLanguageDropdownOnClick);
    
    // Here you would typically set the language in a language service
    console.log(`Language changed to: ${language}`);
    
    // Example: change text based on selected language
    // this.translateService.use(language === 'English' ? 'en' : 'si');
  }

  showAuthPopup() {
    this.showAuthModal = true;
    // Add overflow:hidden to body to prevent scrolling behind modal
    document.body.classList.add('modal-open');
  }

  closeAuthModal(event: Event) {
    // Only close if clicking on the overlay or the close button
    if (
      event.target === document.querySelector('.auth-modal-overlay') ||
      (event.target as HTMLElement).closest('.close-modal-btn')
    ) {
      this.showAuthModal = false;
      document.body.classList.remove('modal-open');
    }
  }

  login(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showAuthModal = false;
    document.body.classList.remove('modal-open');
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.cartItemCount = 0;
  }

  signup(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showAuthDropdown = false;
    this.isAuthDropdownActive = false;
    document.removeEventListener('click', this.closeAuthDropdownOnClick);
    this.router.navigate(['/signup']);
  }

  register(event?: Event) {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    this.showAuthModal = false;
    document.body.classList.remove('modal-open');
    this.router.navigate(['/signup']);
  }

  navigateToCart() {
    if (!this.isLoggedIn) {
      this.login();
      return;
    }
    this.router.navigate(['/cart']);
  }

  showBecomeSellerModal() {
    if (!this.isLoggedIn) {
      this.login();
      return;
    }
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  onSubmitStoreDetails(storeDetails: StoreDetails) {
    this.userService.becomeSeller(storeDetails).subscribe({
      next: (response) => {
        console.log('Successfully became a seller:', response.message);
        this.currentUser = response.user;
        window.location.reload(); // Refresh to update the UI
      },
      error: (error) => {
        console.error('Error becoming a seller:', error);
      }
    });
  }

  navigateToProfile() {
    if (!this.isLoggedIn) {
      this.login();
      return;
    }

    console.log('Navigating to profile. Current user:', this.currentUser);
    console.log('User role:', this.currentUser?.userRole);

    if (this.currentUser?.userRole === 'Seller') {
      console.log('Navigating to seller profile');
      this.router.navigate(['/seller-profile']);
    } else {
      console.log('Navigating to customer profile');
      this.router.navigate(['/customer-profile']);
    }
  }

  toggleAuthDropdownClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isAuthDropdownActive = !this.isAuthDropdownActive;
    this.showAuthDropdown = this.isAuthDropdownActive;
    
    // Clean up old listener first
    document.removeEventListener('click', this.closeAuthDropdownOnClick);
    
    // Add click outside listener to close dropdown when clicking elsewhere
    if (this.isAuthDropdownActive) {
      // Use a slight delay to avoid the current click being immediately registered
      setTimeout(() => {
        document.addEventListener('click', this.closeAuthDropdownOnClick);
      }, 100);
    }
  }

  closeAuthDropdownOnClick = (event: Event) => {
    const dropdown = document.querySelector('.auth-dropdown');
    const button = document.querySelector('.account-btn');
    
    // Don't close if clicking inside dropdown or on the button
    if (dropdown?.contains(event.target as Node) || 
        button?.contains(event.target as Node)) {
      return;
    }
    
    // Close dropdown when clicking outside
    this.isAuthDropdownActive = false;
    document.removeEventListener('click', this.closeAuthDropdownOnClick);
  }

  toggleLanguageDropdownClick(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isLanguageDropdownActive = !this.isLanguageDropdownActive;
    
    // Close auth dropdown if open
    this.isAuthDropdownActive = false;
    
    // Clean up old listener first
    document.removeEventListener('click', this.closeLanguageDropdownOnClick);
    
    // Add click outside listener to close dropdown when clicking elsewhere
    if (this.isLanguageDropdownActive) {
      // Use a slight delay to avoid the current click being immediately registered
      setTimeout(() => {
        document.addEventListener('click', this.closeLanguageDropdownOnClick);
      }, 100);
    }
  }

  closeLanguageDropdownOnClick = (event: Event) => {
    const dropdown = document.querySelector('.language-dropdown');
    const selector = document.querySelector('.language-selector span, .language-selector i');
    
    // Don't close if clicking inside dropdown or on the selector
    if (dropdown?.contains(event.target as Node) || 
        selector?.contains(event.target as Node)) {
      return;
    }
    
    // Close dropdown when clicking outside
    this.isLanguageDropdownActive = false;
    document.removeEventListener('click', this.closeLanguageDropdownOnClick);
  }

  // Add a getter for the user's first name
  get userFirstName(): string {
    if (!this.currentUser || !this.currentUser.name) {
      return 'User';
    }
    
    // If the name comes from Google (usually in "First Last" format)
    // Extract just the first name
    const fullName = this.currentUser.name;
    const firstSpace = fullName.indexOf(' ');
    
    if (firstSpace > 0) {
      // Return just the first part of the name (before the first space)
      return fullName.substring(0, firstSpace);
    }
    
    // If there's no space, return the whole name
    return fullName;
  }

  toggleUserDropdown(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isUserDropdownActive = !this.isUserDropdownActive;
    this.showUserDropdown = this.isUserDropdownActive;
    
    // Clean up old listener first
    document.removeEventListener('click', this.closeUserDropdownOnClick);
    
    // Add click outside listener to close dropdown when clicking elsewhere
    if (this.isUserDropdownActive) {
      // Use a slight delay to avoid the current click being immediately registered
      setTimeout(() => {
        document.addEventListener('click', this.closeUserDropdownOnClick);
      }, 100);
    }
  }

  closeUserDropdownOnClick = (event: Event) => {
    const dropdown = document.querySelector('.user-dropdown');
    const button = document.querySelector('.account-button');
    
    // Don't close if clicking inside dropdown or on the button
    if (dropdown?.contains(event.target as Node) || 
        button?.contains(event.target as Node)) {
      return;
    }
    
    // Close dropdown when clicking outside
    this.isUserDropdownActive = false;
    this.showUserDropdown = false;
    document.removeEventListener('click', this.closeUserDropdownOnClick);
  }

  becomeSeller() {
    this.showBecomeSellerModal();
    // Close the user dropdown
    this.isUserDropdownActive = false;
    this.showUserDropdown = false;
    document.removeEventListener('click', this.closeUserDropdownOnClick);
  }

  toggleCategories(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    this.isCategoriesOpen = !this.isCategoriesOpen;
    
    // Clean up old listener first
    document.removeEventListener('click', this.closeCategoriesOnClick);
    
    // Add click outside listener to close dropdown when clicking elsewhere
    if (this.isCategoriesOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeCategoriesOnClick);
      }, 100);
    }
  }

  closeCategoriesOnClick = (event: Event) => {
    const menu = document.querySelector('.categories-menu');
    const toggle = document.querySelector('.categories-toggle');
    
    // Don't close if clicking inside menu or on the toggle button
    if (menu?.contains(event.target as Node) || 
        toggle?.contains(event.target as Node)) {
      return;
    }
    
    // Close menu when clicking outside
    this.isCategoriesOpen = false;
    document.removeEventListener('click', this.closeCategoriesOnClick);
  }

  onProductTypeChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.selectedProductType = select.value ? +select.value : undefined;
    console.log('Selected product type:', this.selectedProductType);
    
    // Navigate to the shop page with the selected product type
    if (this.selectedProductType) {
      this.router.navigate(['/shop'], { 
        queryParams: { productType: this.selectedProductType } 
      });
    } else {
      this.router.navigate(['/shop']);
    }
  }

  toggleProductTypes(event: Event) {
    event.stopPropagation();
    this.isProductTypeOpen = !this.isProductTypeOpen;
    
    // Close categories dropdown if open
    if (this.isProductTypeOpen) {
      this.isCategoriesOpen = false;
    }
    
    // Add click outside listener
    if (this.isProductTypeOpen) {
      setTimeout(() => {
        document.addEventListener('click', this.closeProductTypeDropdown);
      }, 0);
    }
  }
  
  closeProductTypeDropdown = () => {
    this.isProductTypeOpen = false;
    document.removeEventListener('click', this.closeProductTypeDropdown);
  }
  
  selectProductType(productType: ProductType | undefined, event: Event) {
    event.stopPropagation();
    this.selectedProductType = productType;
    
    // Set the label based on the selected product type
    if (productType === undefined) {
      this.selectedProductTypeLabel = 'All Products';
    } else {
      switch(productType) {
        case ProductType.Fruit:
          this.selectedProductTypeLabel = 'Fruits';
          break;
        case ProductType.Vegetable:
          this.selectedProductTypeLabel = 'Vegetables';
          break;
        case ProductType.DairyProduct:
          this.selectedProductTypeLabel = 'Dairy Products';
          break;
        case ProductType.BakedGood:
          this.selectedProductTypeLabel = 'Baked Goods';
          break;
        case ProductType.HandmadeCraft:
          this.selectedProductTypeLabel = 'Handmade Crafts';
          break;
      }
    }
    
    // Close the dropdown
    this.isProductTypeOpen = false;
    document.removeEventListener('click', this.closeProductTypeDropdown);
    
    // Navigate to the shop page with the selected product type
    if (this.selectedProductType) {
      this.router.navigate(['/shop'], { 
        queryParams: { productType: this.selectedProductType } 
      });
    } else {
      this.router.navigate(['/shop']);
    }
    
    console.log('Selected product type:', this.selectedProductType);
  }
} 