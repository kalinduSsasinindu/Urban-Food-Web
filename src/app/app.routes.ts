import { Routes } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { BecomeSellerComponent } from './components/become-seller/become-seller.component';
import { authGuard } from './guards/auth.guard';
import { LandingComponent } from './components/landing/landing.component';
import { CartComponent } from './components/cart/cart.component';
import { LoginComponent } from './components/auth/login/login.component';
import { SignupComponent } from './components/auth/signup/signup.component';
import { SellerLayoutComponent } from './components/layout/seller-layout/seller-layout.component';
import { SellerProfileLayoutComponent } from './components/layout/seller-profile-layout/seller-profile-layout.component';
import { CustomerProfileLayoutComponent } from './components/layout/customer-profile-layout/customer-profile-layout.component';

export const routes: Routes = [
  { 
    path: 'become-seller', 
    component: BecomeSellerComponent 
  },
  { 
    path: 'cart', 
    component: CartComponent,
    canActivate: [authGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'seller',
    component: SellerLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./components/seller/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./components/seller/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./components/seller/orders/orders.component').then(m => m.OrdersComponent)
      },
      {
        path: '',
        redirectTo: 'products',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'seller-profile',
    component: SellerProfileLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
  },
  {
    path: 'customer-profile',
    component: CustomerProfileLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./components/profile/profile.component').then(m => m.ProfileComponent)
      }
    ]
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
