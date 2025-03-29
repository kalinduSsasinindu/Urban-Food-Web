import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { StoreDetailsModalComponent } from '../../store-details-modal/store-details-modal.component';
import { StoreDetails, User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StoreDetailsModalComponent],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  searchQuery: string = '';
  showModal: boolean = false;
  currentUser: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.isLoggedIn) {
      this.loadUserProfile();
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

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  login() {
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
    this.currentUser = null;
  }

  signup() {
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