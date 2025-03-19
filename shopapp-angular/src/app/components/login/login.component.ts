import { Component,ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { NgForm, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LoginDto } from '../../dtos/user/login.dto';
import { UserService } from '../../service/user.service';
import { Router } from '@angular/router';
import { LoginResponse } from '../../responses/user/login.response';
import { TokenService } from '../../service/token.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule, FormsModule]
})
export class LoginComponent {
  @ViewChild('loginForm') loginForm!: NgForm;
  phoneNumber: string = '1325002112';
  password: string = '1234546';
  constructor(
    private router: Router, 
    private userService: UserService,
    private tokenService: TokenService
  ) { 
    
  }
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  login () {
    const messsage = `Phone: ${this.phoneNumber}, Password: ${this.password}`;
    debugger
    const loginDto:LoginDto = {
      phone_number : this.phoneNumber,
      password : this.password,
    }
    this.userService.login(loginDto).subscribe({
      next: (response: LoginResponse) => {
        debugger
        const {token} = response
        this.tokenService.setToken(token);
        // this.router.navigate(['/login']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert("Cannot login: " + error.error)
        console.error(error.error);
      }
    });
  }
}
