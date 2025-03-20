import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/authentication/auth.service';

export const authGuard = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (sessionStorage.getItem('access_token')) {
    return true;
  }

  // Redirect to home page where the login button is available
  router.navigate(['/']);
  return false;
}; 