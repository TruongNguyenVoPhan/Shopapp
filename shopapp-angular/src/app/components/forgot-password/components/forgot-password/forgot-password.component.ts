import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environment/environment';

type Step = 'email' | 'otp' | 'newPassword' | 'done';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {

  step: Step = 'email';

  email: string = '';
  otp: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  loading: boolean = false;
  errorMsg: string = '';
  countdown: number = 0;
  private countdownInterval: any;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  sendOtp(): void {
    if (!this.email.trim()) {
      this.errorMsg = 'Vui lòng nhập email';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.http.post(`${environment.apiBaseUrl}otp/send`, { email: this.email }, { responseType: 'text' })
      .subscribe({
        next: () => {
          this.loading = false;
          this.step = 'otp';
          this.startCountdown(300); // 5 phút
        },
        error: (err) => {
          this.loading = false;
          this.errorMsg = err.error ?? 'Không tìm thấy email này';
        }
      });
  }

  verifyOtp(): void {
    if (this.otp.length !== 6) {
      this.errorMsg = 'OTP gồm 6 chữ số';
      return;
    }
    this.step = 'newPassword';
    this.errorMsg = '';
  }

  resetPassword(): void {
    if (this.newPassword.length < 6) {
      this.errorMsg = 'Mật khẩu tối thiểu 6 ký tự';
      return;
    }
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg = 'Mật khẩu xác nhận không khớp';
      return;
    }
    this.loading = true;
    this.errorMsg = '';

    this.http.post(`${environment.apiBaseUrl}otp/reset-password`, {
      email: this.email,
      otp: this.otp,
      new_password: this.newPassword
    },{ responseType: 'text' }).subscribe({
      next: () => {
        this.loading = false;
        this.step = 'done';
        clearInterval(this.countdownInterval);
      },
      error: (err) => {
        this.loading = false;
        this.errorMsg = err.error ?? 'OTP không đúng hoặc đã hết hạn';
      }
    });
  }

  resendOtp(): void {
    this.otp = '';
    this.errorMsg = '';
    this.sendOtp();
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  private startCountdown(seconds: number): void {
    this.countdown = seconds;
    clearInterval(this.countdownInterval);
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  get countdownDisplay(): string {
    const m = Math.floor(this.countdown / 60).toString().padStart(2, '0');
    const s = (this.countdown % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}