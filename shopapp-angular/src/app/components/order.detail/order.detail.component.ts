import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FooterComponent } from "../footer/footer.component";
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CartService } from '../../service/cart.service';
import { ProductService } from '../../service/product.sevice';
import { Product } from '../../models/product';
import { environment } from '../../environment/environment';
import { Router } from '@angular/router';
import { OrderResponse } from '../../responses/order/order.response';
import { OrderService } from '../../service/order.service';
import { OrderDetail } from '../../models/order.detail';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order.detail.component.html',
  standalone: true,
  styleUrl: './order.detail.component.scss',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule]
})
export class OrderDetailComponent implements OnInit {
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    email: '',
    phone_number: '',
    address: '',
    note: '',
    order_date: new Date(),
    status: '',
    total_money: 0,
    shipping_method: '',
    shipping_address: '',
    shipping_date: new Date(),
    payment_method: '',
    order_details: [],
  };
  constructor(private orderService: OrderService){} 
  ngOnInit(): void {
    debugger
    this.getOrderDetails();
  }
  getOrderDetails():void{
    debugger
    const orderId = 11;
    this.orderService.getOrderById(orderId).subscribe({
      next: (response: any) => {
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address;
        this.orderResponse.note = response.note;
        this.orderResponse.order_date = new Date(
          response.order_date[0],
          response.order_date[1] - 1,
          response.order_date[2],
        );
        debugger;
        this.orderResponse.order_details = response.order_details
          .map((order_details: OrderDetail) =>{
            order_details.product.thumbnail = `${environment.apiBaseUrl}products/images/${order_details.product.thumbnail}`
            return order_details;
          });
        this.orderResponse.payment_method = response.payment_method;
        this.orderResponse.shipping_date = new Date(
          response.order_date[0],
          response.order_date[1] - 1,
          response.order_date[2],
        );
        this.orderResponse.shipping_method = response.shipping_method;
        this.orderResponse.status = response.status;
        this.orderResponse.total_money = response.total_money;
      },
      complete: () => {
        debugger;
      },
      error: (error: any) => {
        debugger;
        console.error('Error fetching detail:', error)
      }
    }) 
  }
    
}
