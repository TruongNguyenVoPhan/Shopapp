import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/home/home.component'; // Đổi từ AppComponent sang HomeComponent
import { OrderComponent } from './app/order/order.component';
import { OrderCofirmComponent } from './app/order-confirm/order-confirm.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
import { DetailProductComponent } from './app/detail-product/detail-product.component';
import { FormsModule } from '@angular/forms';

bootstrapApplication(LoginComponent, appConfig)
  .catch((err) => console.error(err));
