import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/authentication/auth.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  animations: [
    trigger('slideDown', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-10px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  submitted = false;
  showPassword = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.signupForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      company: [''],
      terms: [false, Validators.requiredTrue]
    });
  }

  // Convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  signupWithGoogle() {
    this.authService.login();
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  passwordMeetsLengthRequirement(): boolean {
    const password = this.signupForm.get('password')?.value;
    return password && password.length >= 8;
  }

  passwordDoesNotContainEmail(): boolean {
    const password = this.signupForm.get('password')?.value;
    const email = this.signupForm.get('email')?.value;
    
    if (!password || !email) return false;
    
    const emailName = email.split('@')[0].toLowerCase();
    return !password.toLowerCase().includes(emailName);
  }

  onSubmit() {
    this.submitted = true;

    // Stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }

    // Process signup
    console.log('Form submitted with:', this.signupForm.value);
    
    // TODO: Call your auth service to register the user
    // this.authService.register(this.signupForm.value)
    //   .subscribe(
    //     () => {
    //       this.router.navigate(['/dashboard']);
    //     },
    //     error => {
    //       console.error('Registration failed:', error);
    //     }
    //   );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
} 