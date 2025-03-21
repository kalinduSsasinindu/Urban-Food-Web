import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { UserService } from '../../../services/user.service';
import { FormsModule } from '@angular/forms';
import { StoreDetailsModalComponent } from '../../store-details-modal/store-details-modal.component';
import { StoreDetails } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StoreDetailsModalComponent],
  template: `
    <nav class="navbar">
      <div class="nav-left">
        <a routerLink="/" class="brand-link">UrbanFood</a>
        <div class="search-container">
          <input 
            type="text" 
            [(ngModel)]="searchQuery" 
            (keyup.enter)="onSearch()"
            placeholder="Search for food, restaurants..."
            class="search-input"
          >
          <button class="search-btn" (click)="onSearch()">
            <i class="fas fa-search">🔍</i>
          </button>
        </div>
      </div>
      <div class="nav-right">
        <button class="nav-btn become-seller-btn" (click)="navigateToBecomeSeller()">Become a Seller</button>
        <ng-container *ngIf="isLoggedIn; else authButtons">
          <a routerLink="/profile" class="nav-btn">Profile</a>
          <button class="nav-btn" (click)="logout()">Logout</button>
        </ng-container>
        <ng-template #authButtons>
          <button class="nav-btn" (click)="login()">Login</button>
          <button class="nav-btn signup-btn" (click)="signup()">Sign Up</button>
        </ng-template>
      </div>
    </nav>

    <app-store-details-modal 
      *ngIf="showModal"
      (closeModal)="closeModal()"
      (submitStoreDetails)="onSubmitStoreDetails($event)"
    ></app-store-details-modal>
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery: string = '';
  showModal: boolean = false;

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

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
    this.authService.login();
  }

  logout() {
    this.authService.logout();
  }

  signup() {
    // TODO: Implement signup functionality
    console.log('Sign up clicked');
  }

  navigateToBecomeSeller() {
    this.router.navigate(['/become-seller']);
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
        window.location.reload(); // Refresh to update the UI
      },
      error: (error) => {
        console.error('Error becoming a seller:', error);
      }
    });
  }
} 