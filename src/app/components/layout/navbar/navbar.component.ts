import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../services/authentication/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
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
        <button class="nav-btn become-seller-btn" (click)="becomeSeller()">Become a Seller</button>
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
  `,
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  searchQuery: string = '';

  constructor(private authService: AuthService) {}

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

  becomeSeller() {
    // TODO: Implement become seller functionality
    console.log('Become seller clicked');
  }
} 