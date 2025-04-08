import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SellerNavbarComponent } from '../seller-navbar/seller-navbar.component';
////htygfnfgnfgng
@Component({
  selector: 'app-seller-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SellerNavbarComponent],
  template: `
    <app-seller-navbar></app-seller-navbar>
    <main class="seller-content">
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    .seller-content {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem 1rem;
    }
  `]
})
export class SellerLayoutComponent {} 