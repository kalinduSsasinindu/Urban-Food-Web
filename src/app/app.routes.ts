import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { authGuard } from './guards/auth.guard';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: '', 
    component: LandingComponent
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
