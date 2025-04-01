import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../services/user.service';
import { firstValueFrom } from 'rxjs';

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

export const sellerGuard = async () => {
  const router = inject(Router);
  const userService = inject(UserService);
  
  // First check if user is authenticated
  if (!sessionStorage.getItem('access_token')) {
    router.navigate(['/']);
    return false;
  }
  
  // Check if role is already in session storage
  const storedRole = sessionStorage.getItem('user_role');
  if (storedRole === 'Seller') {
    return true;
  }
  
  // If not, fetch the user profile and check the role
  try {
    const user = await firstValueFrom(userService.getProfile());
    
    // Store the role for future checks
    if (user.userRole) {
      sessionStorage.setItem('user_role', user.userRole);
    }
    
    if (user.userRole === 'Seller') {
      return true;
    } else {
      router.navigate(['/customer-profile']);
      return false;
    }
  } catch (error) {
    console.error('Error checking user role:', error);
    router.navigate(['/']);
    return false;
  }
}; 