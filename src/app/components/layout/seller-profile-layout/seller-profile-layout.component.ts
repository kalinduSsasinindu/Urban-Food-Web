import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-seller-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  template: `
    <app-navbar></app-navbar>
    <main class="profile-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .profile-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  `]
})
export class SellerProfileLayoutComponent {} 