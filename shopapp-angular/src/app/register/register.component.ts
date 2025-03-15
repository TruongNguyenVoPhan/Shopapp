import { Component, ViewChild } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
  imports: [ FooterComponent, FormsModule, CommonModule]
})
export class RegisterComponent {
  @ViewChild('registerForm') registerForm!: NgForm;
  phone: string = '13250034112';
  password: string = '1234546';
  retypePassword: string = '1234546';
  fullName: string = 'Nguyen Van Coi';
  address: string = 'dia chi 123';
  isAccepted: boolean = true;
  dateOfBirth: Date = new Date();

  constructor(private http: HttpClient, private router: Router) {
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear() - 18);
  }  onPhoneChange() {
    console.log(`Phone typed: ${this.phone}`);
  }
  register() {
    const apiUrl = "http://localhost:8088/api/v1/users/register";
    const registerData = {
      fullname: this.fullName,
      phone_number: this.phone,
      address: this.address,
      password: this.password,
      retype_password: this.retypePassword,
      date_of_birth: this.dateOfBirth,
      facebook_account_id: 0,
      google_account_id: 0,
      role_id: 2
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    
    this.http.post(apiUrl, registerData, { headers }).subscribe({
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
