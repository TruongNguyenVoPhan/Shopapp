import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-order-cofirm',
  templateUrl: './order-confirm.component.html',
  styleUrl: './order-confirm.component.scss',
  imports: [HeaderComponent, FooterComponent]
})
export class OrderCofirmComponent {

}
