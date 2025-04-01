import { Routes } from '@angular/router';
import { ProfileComponent } from './features/user-account/components/profile/profile.component';
import { BecomeSellerComponent } from './features/seller/components/become-seller/become-seller.component';
import { authGuard, sellerGuard } from './core/auth/auth.guard';
import { LandingComponent } from './features/shop/components/landing/landing.component';
import { CartComponent } from './features/shop/components/cart/cart.component';
import { LoginComponent } from './features/auth/components/login/login.component';
import { SignupComponent } from './features/auth/components/signup/signup.component';
import { SellerLayoutComponent } from './layout/seller-layout/seller-layout.component';
import { SellerProfileLayoutComponent } from './layout/seller-profile-layout/seller-profile-layout.component';
import { CustomerProfileLayoutComponent } from './layout/customer-profile-layout/customer-profile-layout.component';

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
    canActivate: [sellerGuard],
    children: [
      {
        path: 'products',
        loadComponent: () => import('./features/seller/components/products/products.component').then(m => m.ProductsComponent)
      },
      {
        path: 'products/add',
        loadComponent: () => import('./features/seller/components/products/add-product/add-product.component').then(m => m.AddProductComponent)
      },
      {
        path: 'products/edit/:id',
        loadComponent: () => import('./features/seller/components/products/add-product/add-product.component').then(m => m.AddProductComponent)
      },
      {
        path: 'customers',
        loadComponent: () => import('./features/seller/components/customers/customers.component').then(m => m.CustomersComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./features/seller/components/orders/orders.component').then(m => m.OrdersComponent)
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
    canActivate: [sellerGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./features/seller/components/profile/seller-profile.component').then(m => m.SellerProfileComponent)
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
        loadComponent: () => import('./features/user-account/components/profile/profile.component').then(m => m.ProfileComponent)
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
