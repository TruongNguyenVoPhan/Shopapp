import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Category } from '../models/categories';

@Injectable({
  providedIn: 'root'
})

export class OrderService {
    private apiUrl = `${environment.apiBaseUrl}orders`;
    constructor(private http: HttpClient) { }
    placeOrder(orderData: any): Observable<any> {
        return this.http.post(this.apiUrl, orderData);
    }
    getOrderById(orderId: number): Observable<any> {
        const url = `${environment.apiBaseUrl}orders/${orderId}`;
        return this.http.get(url);
    }
}