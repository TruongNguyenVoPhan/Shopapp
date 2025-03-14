import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { OrderComponent } from './order/order.component';
import { RegisterComponent } from './register/register.component';

export const routes: Routes = [  
  { path: '', component: HomeComponent }, 
  { path: 'order', component: OrderComponent },
  { path: 'register', component: RegisterComponent }
];
