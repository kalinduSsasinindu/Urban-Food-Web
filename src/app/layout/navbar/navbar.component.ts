import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth';
import { UserService } from '../../core/services';
import { StoreDetails, User } from '../../core/models';
import { StoreDetailsModalComponent } from '../../shared/components/store-details-modal/store-details-modal.component';

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
  showImageSearchModal: boolean = false;
  showLanguageDropdown: boolean = false;
  selectedLanguage: string = 'English';
  currentUser: User | null = null;
  cartItemCount: number = 0;
  uploadedImageSrc: string | null = null;
  hasUploadedImage: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
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
  
  toggleAuthDropdown(event: Event) {
    event.stopPropagation();
    this.showAuthDropdown = !this.showAuthDropdown;
    
    // Close other dropdowns
    this.showLanguageDropdown = false;
    
    // Add click outside listener
    if (this.showAuthDropdown) {
      setTimeout(() => {
        document.addEventListener('click', this.closeAuthDropdown);
      }, 0);
    }
  }
  
  closeAuthDropdown = () => {
    this.showAuthDropdown = false;
    document.removeEventListener('click', this.closeAuthDropdown);
  }
  
  selectLanguage(language: string, event: Event) {
    event.stopPropagation();
    this.selectedLanguage = language;
    this.showLanguageDropdown = false;
    
    // Here you would typically set the language in a language service
    console.log(`Language changed to: ${language}`);
    
    // Example: change text based on selected language
    // this.translateService.use(language === 'English' ? 'en' : 'si');
  }

  login() {
    this.showAuthDropdown = false;
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
    this.cartItemCount = 0;
  }

  signup() {
    this.showAuthDropdown = false;
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
} 