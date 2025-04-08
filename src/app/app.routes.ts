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
import { ProductDetailComponent } from './features/shop/components/products/product-detail/product-detail.component';
import { adminGuard } from './core/auth/admin.guard';

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
    path: 'checkout',
    loadComponent: () => import('./features/shop/components/checkout/checkout.component').then(m => m.CheckoutComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order-confirmation/:id',
    loadComponent: () => import('./features/shop/components/order-confirmation/order-confirmation.component').then(m => m.OrderConfirmationComponent),
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
    path: 'shop/product/:id',
    component: ProductDetailComponent
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
    path: 'account/orders',
    loadComponent: () => import('./features/user-account/components/orders/user-orders.component').then(m => m.UserOrdersComponent),
    canActivate: [authGuard]
  },
  {
    path: 'order-details/:id',
    loadComponent: () => import('./features/shop/components/order-detail/order-detail.component').then(m => m.OrderDetailComponent),
    canActivate: [authGuard]
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
