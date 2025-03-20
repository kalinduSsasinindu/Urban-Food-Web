import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/authentication/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <h2>Welcome to UrbanFood</h2>
        <p>Please sign in to continue</p>
        <button class="google-btn" (click)="login()">
          <img src="assets/google-logo.png" alt="Google Logo" />
          Sign in with Google
        </button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      background-color: #f5f5f5;
    }
    .login-card {
      background: white;
      padding: 2rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    h2 {
      color: #333;
      margin-bottom: 0.5rem;
    }
    p {
      color: #666;
      margin-bottom: 2rem;
    }
    .google-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: white;
      border: 1px solid #ddd;
      padding: 0.75rem 1.5rem;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    .google-btn:hover {
      background-color: #f8f8f8;
    }
    .google-btn img {
      width: 24px;
      height: 24px;
    }
  `]
})
export class LoginComponent implements OnInit {
  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Handle OAuth callback if present
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('code')) {
      this.authService.handleCallback();
    }
  }

  login() {
    this.authService.login();
  }
} 