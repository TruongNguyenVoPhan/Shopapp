import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Category } from '../models/categories';
import { OrderDTO } from '../dtos/order/order.dto';
import { OrderResponse } from '../responses/order/order.response';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
    private apiUrl = `${environment.apiBaseUrl}orders`;
    private apiGetAllOrders = `${environment.apiBaseUrl}orders/get-orders-by-keyword`;

    constructor(private http: HttpClient) { }
    placeOrder(orderData: any): Observable<any> {
        return this.http.post(this.apiUrl, orderData);
    }
    getOrderById(orderId: number): Observable<any> {
        const url = `${environment.apiBaseUrl}orders/${orderId}`;
        return this.http.get(url);
    }
    getAllOrders(keyword:string,
        page: number, limit: number
    ): Observable<OrderResponse[]> {
      debugger
        const params = new HttpParams()
        .set('keyword', keyword)      
        .set('page', page.toString())
        .set('limit', limit.toString());            
        return this.http.get<OrderResponse[]>(this.apiGetAllOrders, { params });
    }
    updateOrder(orderId: number, orderData: OrderDTO): Observable<Object> {
      const url = `${environment.apiBaseUrl}orders/${orderId}`;
      return this.http.put(url, orderData);
    }
    deleteOrder(orderId: number): Observable<any> {
      const url = `${environment.apiBaseUrl}orders/${orderId}`;
      return this.http.delete(url, { responseType: 'text' });
    }

}