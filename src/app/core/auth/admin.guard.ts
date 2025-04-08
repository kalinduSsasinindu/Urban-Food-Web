import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';
import { UserService } from '../services/user.service';
import { map, catchError, of, firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const userService = inject(UserService);
  const authService = inject(AuthService);

  if (!authService.isLoggedIn()) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  try {
    const userProfile = await firstValueFrom(
      userService.getProfile().pipe(
        map(user => {
          if (user && user.userRole === 'Admin') {
            return true;
          }
          router.navigate(['/']);
          return false;
        }),
        catchError(error => {
          console.error('Error checking admin role:', error);
          router.navigate(['/']);
          return of(false);
        })
      )
    );
    
    return userProfile;
  } catch (error) {
    console.error('Error in admin guard:', error);
    router.navigate(['/']);
    return false;
  }
}; 