import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environment/environment';
import { OrderDTO } from '../../../dtos/order/order.dto';
import { OrderResponse } from '../../../responses/order/order.response';
import { OrderService } from '../../../service/order.service';


@Component({
  selector: 'app-order-detail-admin',
  templateUrl: './order.detail.admin.component.html',
  styleUrls: ['./order.detail.admin.component.scss'],
  standalone: true,
  imports: [   
    CommonModule,
    FormsModule,
  ]
})

export class OrderDetailAdminComponent implements OnInit{    
  orderId:number = 0;
  orderResponse: OrderResponse = {
    id: 0,
    user_id: 0,
    fullname: '',
    phone_number: '',
    email: '',
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

  private orderService = inject(OrderService);

  constructor(    
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    debugger
    this.getOrderDetails();
  }

  getOrderDetails(): void {
    debugger
    this.orderId = Number(this.route.snapshot.paramMap.get('id'));
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (response: any) => {      
        debugger  
        this.orderResponse.id = response.id;
        this.orderResponse.user_id = response.user_id;
        this.orderResponse.fullname = response.fullname;
        this.orderResponse.email = response.email;
        this.orderResponse.phone_number = response.phone_number;
        this.orderResponse.address = response.address; 
        this.orderResponse.note = response.note;
        this.orderResponse.total_money = response.total_money;

        if (response.order_date) {
          this.orderResponse.order_date = new Date(
            response.order_date[0], 
            response.order_date[1] - 1, 
            response.order_date[2]
          );        
        }        

        this.orderResponse.order_details = response.order_details.map((detail_order: any) => {
          detail_order.product.thumbnail = `${environment.apiBaseUrl}/products/images/${detail_order.product.thumbnail}`;
          detail_order.number_of_products = detail_order.numberOfProducts;
          return detail_order;
        });        

        this.orderResponse.payment_method = response.payment_method;

        if (response.shipping_date) {
          this.orderResponse.shipping_date = new Date(
            response.shipping_date[0],
            response.shipping_date[1] - 1,
            response.shipping_date[2]
          );
        }

        this.orderResponse.shipping_method = response.shipping_method;        
        this.orderResponse.status = response.status;
      },      
      complete: () => {},
      error: (error: any) => {
        console.error('Error fetching detail:', error);
      },
    });
  }    
  
  saveOrder(): void {   
    debugger 
    this.orderService
      .updateOrder(this.orderId, new OrderDTO(this.orderResponse))
      .subscribe({
        next: (response: Object) => {
          debugger
          this.router.navigate(['../'], { relativeTo: this.route });
        },
        complete: () => {},
        error: (error: any) => {
          console.error('Error updating order:', error);
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      });   
  }
}
