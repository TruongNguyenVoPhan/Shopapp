import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule]
})
export class RegisterComponent {
  @ViewChild(`registerForm`) registerForm!: NgForm;
  phone: string;
  password: string;
  retypePassword: string;
  fullName: string;
  address: string;
  isAccepted: boolean;
  dateOfBirth: Date;
  constructor() {
    this.phone = '';
    this.password = '';
    this.retypePassword = '';
    this.fullName = '';
    this.address = '';
    this.isAccepted = false;
    this.dateOfBirth = new Date();
    
  }
  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }
  register() {
    const message = `phone: ${this.phone}` +
      `password: ${this.password}` +
      `retypePassword: ${this.retypePassword}` +
      `fullName: ${this.fullName}` +
      `address: ${this.address}` +
      `isAccepted: ${this.isAccepted}` +
      `dateOfBirth : ${this.dateOfBirth}`;
    alert(message)
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
