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
import { RoleService } from '../../service/role.sevice';
import { Role }from  '../../models/role';

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

  roles: Role[] = [];
  rememberMe: boolean = true;
  selectedRole: Role | undefined;
  constructor(
    private router: Router, 
    private userService: UserService,
    private tokenService: TokenService,
    private roleService: RoleService,
  ) { 
    
  }
  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  ngOnInit(){
    debugger
    this.roleService.getRoles().subscribe({
      next: (roles: Role[]) => {
        debugger
        this.roles = roles;
        this.selectedRole = roles.length > 0 ? roles[0] : undefined; 
      },
      complete: () => {
        debugger
      },  
      error: (error: any) => {
        debugger
        console.error(error);
      }
    });
  }
  
  login () {
    const messsage = `Phone: ${this.phoneNumber}, Password: ${this.password}`;
    debugger
    const loginDto:LoginDto = {
      phone_number : this.phoneNumber,
      password : this.password,
      role_id: this.selectedRole?.id ?? 1
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
        console.error(error.error.messsage);
      }
    });
  }
}
