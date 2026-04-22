import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';
import { Product } from '../models/product';
import { ProductService } from './product.sevice';

@Injectable({
  providedIn: 'root'
})
export class CartService{
   private cart: Map<number, number> = new Map();//Dùng Map để lưu trữ giỏ hàng, key là id sản phẩm , value là số lượng sản phẩm

    constructor(){
        const storedCart = sessionStorage.getItem('cart');
        if (storedCart) {
            this.cart = new Map(JSON.parse(storedCart));
        }
    }

    addToCart(productId: number, quantity: number = 1): void {
        debugger
        if (this.cart.has(productId)) {
            // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng lên `quantity`
            this.cart.set(productId, this.cart.get(productId)! + quantity);
        }else {
            // Nếu sản phẩm chưa có trong giỏ hàng, thêm sản phẩm vào với số lượng là `quantity`
            this.cart.set(productId, quantity);
        }
        // Sau khi thay đổi giỏ hàng, lưu trữ nó vào sessionStorage
        sessionStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }
    getCart(): Map<number, number> {
        return this.cart;
    }
    getQuantity(productId: number): number {
        const cart = this.getCart();
        return cart.get(productId) || 0;
    }
    // Lưu trữ giỏ hàng vào sessionStorage
    private saveCartToSessionStorage(): void {
        debugger
        sessionStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }
    updateQuantity(productId: number, quantity: number) {
    const cart = this.getCart();

    if (quantity <= 0) {
        cart.delete(productId);
    } else {
        cart.set(productId, quantity);
    }

    this.saveCart();
    }
    removeFromCart(productId: number) {
    const cart = this.getCart();
    cart.delete(productId);
    this.saveCart();
    }
    private saveCart(): void {
        sessionStorage.setItem('cart', JSON.stringify(Array.from(this.cart.entries())));
    }
    // Hàm xóa dữ liệu giỏ hàng và cập nhật sessionStorage
    clearCart(): void {
        this.cart.clear(); // Xóa giỏ hàng
        sessionStorage.removeItem('cart'); // Xóa dữ liệu giỏ hàng trong sessionStorage
    }
}