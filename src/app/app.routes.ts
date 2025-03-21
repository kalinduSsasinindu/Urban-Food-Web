import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { BecomeSellerComponent } from './components/become-seller/become-seller.component';
import { authGuard } from './guards/auth.guard';
import { LandingComponent } from './components/landing/landing.component';

export const routes: Routes = [
  { 
    path: 'profile', 
    component: ProfileComponent, 
    canActivate: [authGuard] 
  },
  { 
    path: 'become-seller', 
    component: BecomeSellerComponent 
  },
  { 
    path: '', 
    component: LandingComponent,
    pathMatch: 'full'
  },
  { 
    path: '**', 
    redirectTo: '' 
  }
];
