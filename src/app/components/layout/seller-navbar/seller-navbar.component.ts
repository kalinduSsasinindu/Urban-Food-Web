import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-seller-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, FormsModule],
  templateUrl: './seller-navbar.component.html',
  styleUrls: ['./seller-navbar.component.css']
})
export class SellerNavbarComponent {
  navItems = [
    { path: '/seller/products', label: 'Products', icon: '📦' },
    { path: '/seller/customers', label: 'Customers', icon: '👥' },
    { path: '/seller/orders', label: 'Orders', icon: '📋' }
  ];

  searchQuery: string = '';
  userProfile: User | null = null;

  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {
    this.loadUserProfile();
  }

  loadUserProfile() {
    this.userService.getProfile().subscribe(user => {
      this.userProfile = user;
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      // TODO: Implement search functionality
      console.log('Searching for:', this.searchQuery);
    }
  }

  logout() {
    this.authService.logout();
  }
} 