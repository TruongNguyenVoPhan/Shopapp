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

@Component({
  selector: 'app-order-cofirm',
  templateUrl: './order-confirm.component.html',
  standalone: true,
  styleUrl: './order-confirm.component.scss',
  imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule]
})
export class OrderCofirmComponent implements OnInit {
  cartItems: {product: Product, quantity: number}[] = [];
  totalAmount: number = 0;
  // couponCode: String: '';
  constructor(
    private cartService: CartService,
    private router: Router,
    private productService: ProductService) { 
  }
  ngOnInit(): void {
    debugger
    const cart = this.cartService.getCart();
    const productIds = Array.from(cart.keys());
    debugger
    this.productService.getProductByIds(productIds).subscribe({
      next: (products) => {
        debugger
        this.cartItems = productIds.map((productId) => {
          debugger
          const product = products.find((p) => p.id === productId);
          if (product) {
            product.thumbnail = `${environment.apiBaseUrl}products/images/${product.thumbnail}`
          }
          return { 
            product: product!, 
            quantity: cart.get(productId)! 
          };
        });
      },
      complete:() => {
        debugger
        this.calculateTotal();
      },
      error: (error: any) => {
        debugger
        console.error('Error fetching products:', error);
      }
    });
  }
  calculateTotal(): void {
    this.totalAmount = this.cartItems.reduce(
      (total, item) => total + item.product.price * item.quantity, 
      0
    );
  }
    
}
