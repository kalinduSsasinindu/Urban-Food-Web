import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/authentication/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  template: `
    <nav class="navbar" *ngIf="isLoggedIn">
      <div class="nav-brand">UrbanFood</div>
      <div class="nav-links">
        <a routerLink="/profile" class="nav-link">Profile</a>
        <button class="nav-link" (click)="logout()">Logout</button>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100vh;
    }
    .navbar {
      background: #fff;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .nav-brand {
      font-size: 1.5rem;
      font-weight: bold;
      color: #333;
    }
    .nav-links {
      display: flex;
      gap: 1rem;
    }
    .nav-link {
      background: none;
      border: none;
      padding: 0.5rem 1rem;
      cursor: pointer;
      color: #666;
      transition: color 0.2s;
      text-decoration: none;
    }
    .nav-link:hover {
      color: #333;
    }
    main {
      min-height: calc(100vh - 64px);
    }
  `]
})
export class AppComponent {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return !!sessionStorage.getItem('access_token');
  }

  logout() {
    this.authService.logout();
  }
}
