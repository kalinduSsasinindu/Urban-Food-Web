import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-customer-profile-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  template: `
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
export class CustomerProfileLayoutComponent {} 