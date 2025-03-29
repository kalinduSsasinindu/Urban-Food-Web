import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import { User } from '../../../models/user.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-seller-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="seller-profile-container">
      <h1>Seller Profile</h1>
      <div class="seller-info" *ngIf="user">
        <div class="info-section">
          <h2>Store Information</h2>
          <div class="info-item">
            <label>Store Name:</label>
            <span>{{ user.sellerProfile?.storeDetails?.storeName }}</span>
          </div>
          <div class="info-item">
            <label>Store Description:</label>
            <span>{{ user.sellerProfile?.storeDetails?.storeDescription }}</span>
          </div>
          <div class="info-item">
            <label>Average Rating:</label>
            <span>{{ user.sellerProfile?.averageRating | number:'1.1-1' }} ★</span>
          </div>
          <div class="info-item">
            <label>Verified Seller:</label>
            <span>{{ user.sellerProfile?.isVerifiedSeller ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .seller-profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .seller-info {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      padding: 2rem;
      margin-top: 2rem;
    }
    .info-section {
      margin-bottom: 2rem;
    }
    .info-section h2 {
      color: #333;
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 2px solid #eee;
    }
    .info-item {
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
    }
    .info-item label {
      font-weight: bold;
      color: #666;
      min-width: 150px;
    }
    .info-item span {
      color: #333;
    }
  `]
})
export class SellerProfileComponent implements OnInit {
  user: User | null = null;

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUserProfile();
  }

  private async loadUserProfile() {
    try {
      this.user = await firstValueFrom(this.userService.getProfile());
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  }
} 