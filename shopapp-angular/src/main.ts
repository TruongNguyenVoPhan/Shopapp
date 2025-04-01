import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/components/home/home.component'; // Đổi từ AppComponent sang HomeComponent
import { OrderComponent } from './app/components/order/order.component';
import { OrderCofirmComponent } from './app/components/order-confirm/order-confirm.component';
import { LoginComponent } from './app/components/login/login.component';
import { RegisterComponent } from './app/components/register/register.component';
import { DetailProductComponent } from './app/components/detail-product/detail-product.component';
import { FormsModule } from '@angular/forms';

bootstrapApplication(OrderCofirmComponent, appConfig)
  .catch((err) => console.error(err));
