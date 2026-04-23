import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../environment/environment';
import { TokenService } from './token.service';
import { CartItem } from '../models/cart-item';
import { CartItemDTO } from '../dtos/cart/cart-item.dto';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiBaseUrl}cart`;

  // BehaviorSubject để các component khác (vd: header badge) subscribe số lượng
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  cartItems$ = this.cartItemsSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({ Authorization: `Bearer ${token}` });
  }

  // Load giỏ hàng từ server (gọi sau khi login)
  loadCart(): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(this.apiUrl, {
      headers: this.getHeaders()
    }).pipe(
      tap(items => this.cartItemsSubject.next(items))
    );
  }

  // Thêm sản phẩm
  addToCart(productId: number, quantity: number = 1): Observable<CartItem[]> {
    const dto = new CartItemDTO(productId, quantity);
    return this.http.post<CartItem[]>(`${this.apiUrl}/add`, dto, {
      headers: this.getHeaders()
    }).pipe(
      tap(items => this.cartItemsSubject.next(items))
    );
  }

  // Cập nhật số lượng
  updateQuantity(productId: number, quantity: number): Observable<CartItem[]> {
    const dto = new CartItemDTO(productId, quantity);
    return this.http.put<CartItem[]>(`${this.apiUrl}/update`, dto, {
      headers: this.getHeaders()
    }).pipe(
      tap(items => this.cartItemsSubject.next(items))
    );
  }

  // Xóa 1 item
  removeFromCart(productId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/item/${productId}`, {
      headers: this.getHeaders()
    }).pipe(
      tap(() => {
        const updated = this.cartItemsSubject.value
          .filter(i => i.product.id !== productId);
        this.cartItemsSubject.next(updated);
      })
    );
  }

  // Lấy cart hiện tại (local, không gọi API)
  getCartSnapshot(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  // Tổng số lượng items (cho badge trên header)
  getQuantity(productId: number): number {
    const item = this.cartItemsSubject.value
        .find(i => i.product.id === productId);

    return item ? item.quantity : 0;
    }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    }
}