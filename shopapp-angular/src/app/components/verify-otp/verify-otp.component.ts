import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environment/environment';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  imports: [HeaderComponent, FooterComponent,CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true,
  templateUrl: './verify-otp.component.html',
  styleUrls: ['./verify-otp.component.scss'],
})
export class VerifyOtpComponent {

  email: string = '';
  otp: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {
    this.email = this.route.snapshot.queryParams['email'];
  }

  verify() {
    this.http.post(
        `${environment.apiBaseUrl}otp/verify`,
        {
        email: this.email,
        otp: this.otp
        },
        {
        responseType: 'text'
        }
    ).subscribe({
        next: (response) => {
        alert(response);
        this.router.navigate(['/login']);
        },
        error: (err) => {
        alert(err.error);
        }
    });
    }

  resendOtp() {
    this.http.post(
        `${environment.apiBaseUrl}otp/send`,
        {
        email: this.email
        },
        {
        responseType: 'text'
        }
    ).subscribe({
        next: (response) => {
        alert(response);
        },
        error: (err) => {
        alert(err.error);
        }
    });
    }
}