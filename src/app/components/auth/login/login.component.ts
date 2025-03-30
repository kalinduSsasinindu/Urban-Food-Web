import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  isEmailValidated: boolean = false;
  emailError: string = '';
  showPassword: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  validateEmail() {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!this.email) {
      this.emailError = 'Email is required';
      return;
    }

    if (!emailRegex.test(this.email)) {
      this.emailError = 'Please enter a valid email address';
      return;
    }

    // Clear any previous errors
    this.emailError = '';
    // Show password field
    this.isEmailValidated = true;
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  loginWithGoogle() {
    this.authService.login();
  }

  loginWithEmail() {
    if (!this.password) {
      // Handle password validation
      return;
    }
    
    // Implement login logic here
    console.log('Logging in with:', this.email, this.password);
  }

  loginWithPhone() {
    this.router.navigate(['/login/phone']);
  }

  navigateToSignup() {
    this.router.navigate(['/signup']);
  }
} 