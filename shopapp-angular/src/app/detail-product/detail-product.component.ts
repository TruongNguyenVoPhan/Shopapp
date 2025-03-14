import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";

@Component({
  selector: 'app-detail-product',
  templateUrl: './detail-product.component.html',
  standalone: true,
  styleUrl: './detail-product.component.scss',
  imports: [HeaderComponent, FooterComponent]
})
export class DetailProductComponent {

}
