import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { firstValueFrom } from 'rxjs';
import { User } from '../../../../core/models';
import { UserService } from '../../../../core/services';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="profile-container" *ngIf="user">
      <div class="profile-card">
        <div class="profile-header">
          <img [src]="user.profilePictureUrl || 'assets/default-avatar.png'" alt="Profile Picture" class="profile-picture" />
          <h2>{{ user.name }}</h2>
          <p class="email">{{ user.email }}</p>
        </div>
        <div class="profile-details">
          <div class="detail-item">
            <label>Role:</label>
            <span>{{ user.userRole }}</span>
          </div>
          <div class="detail-item" *ngIf="user.phone">
            <label>Phone:</label>
            <span>{{ user.phone }}</span>
          </div>
          <div class="detail-item" *ngIf="user.address">
            <label>Address:</label>
            <span>
              {{ user.address?.street }}, {{ user.address?.city }},
              {{ user.address?.state }} {{ user.address?.zipCode }}
            </span>
          </div>
          <div class="detail-item" *ngIf="user.userRole === 'Seller' && user.sellerProfile?.storeDetails">
            <label>Store Name:</label>
            <span>{{ user.sellerProfile?.storeDetails?.storeName }}</span>
          </div>
          <div class="detail-item" *ngIf="user.userRole === 'Seller' && user.sellerProfile?.storeDetails">
            <label>Store Description:</label>
            <span>{{ user.sellerProfile?.storeDetails?.storeDescription }}</span>
          </div>
          <div class="detail-item" *ngIf="user.userRole === 'Seller' && user.sellerProfile">
            <label>Average Rating:</label>
            <span>{{ user.sellerProfile?.averageRating | number:'1.1-1' }} ★</span>
          </div>
          <div class="detail-item" *ngIf="user.userRole === 'Seller' && user.sellerProfile">
            <label>Verified Seller:</label>
            <span>{{ user.sellerProfile?.isVerifiedSeller ? 'Yes' : 'No' }}</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }
    .profile-card {
      background: white;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .profile-header {
      background: linear-gradient(135deg, #4a90e2, #7e57c2);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    .profile-picture {
      width: 120px;
      height: 120px;
      border-radius: 60px;
      border: 4px solid white;
      margin-bottom: 1rem;
    }
    .email {
      opacity: 0.8;
      margin-top: 0.5rem;
    }
    .profile-details {
      padding: 2rem;
    }
    .detail-item {
      margin-bottom: 1rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid #eee;
    }
    .detail-item:last-child {
      border-bottom: none;
    }
    label {
      font-weight: bold;
      color: #666;
      margin-right: 1rem;
      min-width: 100px;
      display: inline-block;
    }
  `]
})
export class ProfileComponent implements OnInit {
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