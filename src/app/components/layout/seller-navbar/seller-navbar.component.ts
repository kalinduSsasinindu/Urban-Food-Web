import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';

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

  constructor(private authService: AuthService) {}

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