import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { HomeComponent } from './app/home/home.component'; // Đổi từ AppComponent sang HomeComponent

bootstrapApplication(HomeComponent, appConfig)
  .catch((err) => console.error(err));
