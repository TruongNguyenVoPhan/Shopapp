import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../service/order.service';
import { OrderDetail } from '../../models/order.detail';
import { environment } from '../../environment/environment';
import { OnInit } from '@angular/core';
import { UserService } from '../../service/user.service';

@Component({
  selector: 'app-purchase',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './purchase.component.html',
  styleUrls: ['./purchase.component.scss']
})
export class PurchaseComponent implements OnInit {

  orders:any[] = [];
  userId:number = 0;

  constructor(
    private orderService: OrderService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
        const user = this.userService.getUserFromSession();

    if(user){
        this.userId = user.id;
    }

    this.loadOrders();
    }

  loadOrders() {

    this.orderService.getOrdersByUser(1)
      .subscribe({

        next: (response:any) => {

          this.orders = response.map((order:any) => {

            order.order_details =
              order.order_details.map((detail:OrderDetail)=>{

                detail.product.thumbnail =
                  `${environment.apiBaseUrl}products/images/${detail.product.thumbnail}`;

                return detail;
              });

            return order;
          });
        }

      });
  }
  loadAllOrders() {

    this.orderService
        .getOrdersByUser(this.userId)
        .subscribe({
        next:(response)=>{
            this.orders = response;
        }
        });
    }

    filterStatus(status:string) {

    this.orderService
        .getOrdersByStatus(this.userId,status)
        .subscribe({
        next:(response)=>{
            this.orders = response;
        }
        });
}
}