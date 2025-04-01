import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../../core/services/user.service';
import { AuthService } from '../../../../core/auth/auth.service';
import { StoreDetails } from '../../../../core/models/user.model';

@Component({
  selector: 'app-become-seller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="become-seller-container">
      <div class="become-seller-content">
        <h1>Become a Seller</h1>
        
        <div *ngIf="!isLoggedIn" class="login-prompt">
          <p>Please sign in to become a seller</p>
          <button class="btn btn-primary" (click)="login()">Sign In</button>
        </div>

        <div *ngIf="isLoggedIn" class="seller-form">
          <p class="form-description">Fill in your store details to start selling on UrbanFood</p>
          
          <form (ngSubmit)="onSubmit()">
            <div class="form-group">
              <label for="storeName">Store Name</label>
              <input 
                type="text" 
                id="storeName" 
                [(ngModel)]="storeName" 
                name="storeName" 
                required
                class="form-control"
                placeholder="Enter your store name"
              >
            </div>
            
            <div class="form-group">
              <label for="storeDescription">Store Description</label>
              <textarea 
                id="storeDescription" 
                [(ngModel)]="storeDescription" 
                name="storeDescription" 
                required
                class="form-control"
                rows="4"
                placeholder="Describe your store and what you sell"
              ></textarea>
            </div>

            <div *ngIf="error" class="error-message">
              {{ error }}
            </div>

            <div class="form-actions">
              <button type="submit" class="btn btn-primary" [disabled]="isSubmitting">
                {{ isSubmitting ? 'Submitting...' : 'Submit' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .become-seller-container {
      padding: 2rem;
      min-height: calc(100vh - 64px);
      background-color: #f5f5f5;
    }

    .become-seller-content {
      max-width: 600px;
      margin: 0 auto;
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    h1 {
      color: #333;
      margin-bottom: 1.5rem;
      text-align: center;
    }

    .login-prompt {
      text-align: center;
      padding: 2rem;
    }

    .login-prompt p {
      margin-bottom: 1rem;
      color: #666;
    }

    .form-description {
      color: #666;
      margin-bottom: 2rem;
      text-align: center;
    }

    .form-group {
      margin-bottom: 1.5rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      color: #333;
      font-weight: 500;
    }

    .form-control {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-control:focus {
      outline: none;
      border-color: #4a4a4a;
    }

    .form-actions {
      display: flex;
      justify-content: center;
      margin-top: 2rem;
    }

    .btn {
      padding: 0.75rem 2rem;
      border-radius: 4px;
      border: none;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background-color: #4a4a4a;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background-color: #333;
    }

    .btn:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    .error-message {
      color: red;
      margin-top: 1rem;
      text-align: center;
    }
  `]
})
export class BecomeSellerComponent implements OnInit {
  isLoggedIn: boolean = false;
  isSubmitting: boolean = false;
  storeName: string = '';
  storeDescription: string = '';
  error: string = '';

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = !!sessionStorage.getItem('access_token');
  }

  login() {
    this.authService.login();
  }

  onSubmit() {
    if (!this.storeName || !this.storeDescription) {
      this.error = 'Please fill in all fields';
      return;
    }

    const storeDetails: StoreDetails = {
      storeName: this.storeName,
      storeDescription: this.storeDescription
    };

    this.userService.becomeSeller(storeDetails).subscribe({
      next: (response) => {
        console.log('Successfully became a seller:', response.message);
        this.router.navigate(['/profile']);
      },
      error: (error) => {
        console.error('Error becoming a seller:', error);
        this.error = 'Failed to become a seller. Please try again.';
      }
    });
  }
} 