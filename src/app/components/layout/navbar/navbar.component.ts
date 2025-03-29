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
  templateUrl: './navbar.component.html',
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
    this.router.navigate(['/login']);
  }

  logout() {
    this.authService.logout();
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
        window.location.reload(); // Refresh to update the UI
      },
      error: (error) => {
        console.error('Error becoming a seller:', error);
      }
    });
  }
} 