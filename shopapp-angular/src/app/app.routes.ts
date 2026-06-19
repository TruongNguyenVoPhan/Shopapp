import { NgModule, importProvidersFrom } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { 
  DetailProductComponent 
} from './components/detail-product/detail-product.component';
import { OrderComponent } from './components/order/order.component';
import { OrderDetailComponent } from './components/order.detail/order.detail.component';
import { UserProfileComponent } from './components/user-profile/user.profile.component';
import { AdminComponent } from './components/admin/admin.component';
import { AuthGuardFn } from './guards/auth.guard';
import { AdminGuardFn } from './guards/admin.guard';
import { VerifyOtpComponent } from './components/verify-otp/verify-otp.component';
// import { OrderAdminComponent } from './components/admin/order/order.admin.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { ForgotPasswordComponent } from './components/forgot-password/components/forgot-password/forgot-password.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },  
  { path: 'register', component: RegisterComponent },
  { path: 'products/:id', component: DetailProductComponent },  
  { path: 'orders', component: OrderComponent,canActivate:[AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate:[AuthGuardFn] },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'verify-otp', component: VerifyOtpComponent },
  { path: 'purchase', component: PurchaseComponent },
  {path: 'forgot-password',component: ForgotPasswordComponent},
  // Admin   
  { 
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuardFn],
    children: [
      {
        path: 'orders',
        loadComponent: () =>
          import('./components/admin/order/order.admin.component')
            .then(m => m.OrderAdminComponent)
      }
    ]
  },      
];
