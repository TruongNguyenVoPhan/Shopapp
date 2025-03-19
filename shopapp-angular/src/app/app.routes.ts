import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { OrderComponent } from './components/order/order.component';
import { RegisterComponent } from './components/register/register.component';

export const routes: Routes = [  
  { path: '', component: HomeComponent }, 
  { path: 'order', component: OrderComponent },
  { path: 'register', component: RegisterComponent }
];
