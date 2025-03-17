import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { RegisterDto } from '../dtos/user/register.dto';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [ FooterComponent, FormsModule, CommonModule]
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  phoneNumber: string = '';
  password: string = '';
  retypePassword: string = '';
  fullName: string = '';
  address: string = '';
  isAccepted: boolean = true;
  dateOfBirth: Date = new Date();

  constructor(private router: Router, private userService: UserService) {
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }  onPhoneNumberChange() {
    console.log(`Phone typed: ${this.phoneNumber}`);
  }
  register() {
    const registerDto:RegisterDto = {
      fullname: this.fullName,
      phone_number: this.phoneNumber,
      address: this.address,
      password: this.password,
      retype_password: this.retypePassword,
      date_of_birth: this.dateOfBirth,
      facebook_account_id: "0",
      google_account_id: "0",
      role_id: 2
    }
    this.userService.register(registerDto).subscribe({
      next: (response: any) => {
        debugger
        this.router.navigate(['/login']);
      },
      complete: () => {
        debugger
      },
      error: (error: any) => {
        debugger
        alert("Cannot register: " + error.error)
        console.error(error.error);
      }
    });
      
  }
  checkPasswordsMatch() {
    if (this.password !== this.retypePassword) {
      this.registerForm.form.controls['retypePassword']
        .setErrors({ 'passwordMismatch': true });
    } else {
      this.registerForm.form.controls['retypePassword'].setErrors(null);
    }
  }
  checkAge(){
    if(this.dateOfBirth){
      const today = new Date();
      const birhtDay = new Date(this.dateOfBirth);
      let age = today.getFullYear() - birhtDay.getFullYear();
      const Month = today.getMonth() - birhtDay.getMonth();
      if(Month < 0 || (Month === 0 && today.getDate() < birhtDay.getDate())){
        age--;
      }
      if(age < 18){
        this.registerForm.form.controls['dateOfBirth'].setErrors({ 'underAge': true });
      }else{
        this.registerForm.form.controls['dateOfBirth'].setErrors(null);
      }
    }
  }
}
