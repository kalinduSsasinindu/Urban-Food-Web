import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-seller-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="secondary-nav">
      <div class="nav-container">
        <div class="nav-items">
          <a 
            *ngFor="let item of navItems" 
            [routerLink]="item.path" 
            routerLinkActive="active"
            class="nav-item"
          >
            <span class="icon">{{ item.icon }}</span>
            <span class="label">{{ item.label }}</span>
          </a>
        </div>
      </div>
    </nav>
    <main class="profile-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .secondary-nav {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
      padding: 0.5rem 0;
    }
    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    .nav-items {
      display: flex;
      gap: 1rem;
    }
    .nav-item {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      text-decoration: none;
      color: #495057;
      border-radius: 4px;
      transition: all 0.2s ease;
    }
    .nav-item:hover {
      background-color: #e9ecef;
      color: #212529;
    }
    .nav-item.active {
      background-color: #e9ecef;
      color: #212529;
      font-weight: 500;
    }
    .icon {
      font-size: 1.2rem;
    }
    .label {
      font-size: 0.9rem;
    }
    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  `]
})
export class SellerProfileLayoutComponent {
  navItems = [
    { path: '/seller/products', label: 'Products', icon: '📦' },
    { path: '/seller/customers', label: 'Customers', icon: '👥' },
    { path: '/seller/orders', label: 'Orders', icon: '📋' }
  ];
} 