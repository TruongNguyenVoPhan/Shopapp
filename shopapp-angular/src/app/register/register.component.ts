import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  imports: [HeaderComponent, FooterComponent , FormsModule]
})
export class RegisterComponent {
  phone: string;
  password: string;
  retypePassword: string; 
  fullName: String;
  address: String;
  isAccepted: boolean;
  dateOfBirth: Date;  
  constructor(){
    this.phone = "";
    this.password = "";
    this.retypePassword="";
    this.fullName = "";
    this.address = "";
    this.isAccepted = false;
    this.dateOfBirth = new Date();
    this.dateOfBirth.setFullYear(this.dateOfBirth.getFullYear()-18)
  }
  onPhoneChange(){
    console.log(`Phone typed: ${this.phone}`);
  }
  register(){
    const message = `phone: ${this.phone}`
    + `password: ${this.password}`
    + `retypePassword: ${this.retypePassword}`
    + `fullName: ${this.fullName}`
    + `address: ${this.address}`
    + `isAccepted: ${this.isAccepted}`;
    + `dateOfBirth : ${this.dateOfBirth}`
   alert(message)
  }
}
