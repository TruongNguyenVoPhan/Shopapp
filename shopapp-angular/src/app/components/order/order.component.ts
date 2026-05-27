// src/app/components/order/order.component.ts

import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { OrderService } from '../../service/order.service';
import { TokenService } from '../../service/token.service';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { OrderDTO } from '../../dtos/order/order.dto';
import { environment } from '../../environment/environment';

@Component({
    selector: 'app-order',
    standalone: true,
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
    imports: [HeaderComponent, FooterComponent, FormsModule, CommonModule, ReactiveFormsModule]
})
export class OrderComponent implements OnInit {
    orderForm: FormGroup;
    cartItems: { product: Product; quantity: number }[] = [];
    totalAmount: number = 0;

    orderData: OrderDTO = {
        user_id: 0,
        fullname: '',
        email: '',
        status: 'pending',
        phone_number: '',
        address: '',
        note: '',
        total_money: 0,
        payment_method: 'COD',
        shipping_method: 'express',
        coupon_code: '',
        cart_items: []
    };

    constructor(
        private cartService: CartService,
        private orderService: OrderService,
        private tokenService: TokenService,
        private formBuilder: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private http: HttpClient
    ) {
        this.orderForm = this.formBuilder.group({
            fullname: ['', Validators.required],
            email: ['', [Validators.email]],
            phone_number: ['', [Validators.required, Validators.minLength(6)]],
            address: ['', [Validators.required, Validators.minLength(5)]],
            note: [''],
            shipping_method: ['express'],
            payment_method: ['COD']
        });
    }

    ngOnInit(): void {
        this.orderData.user_id = this.tokenService.getUserId()!;

        // Patch form với thông tin user từ session
        const userInfo = sessionStorage.getItem('user');
        if (userInfo) {
            const parsedUser = JSON.parse(userInfo);
            this.orderForm.patchValue({
                fullname: parsedUser.fullname || '',
                email: parsedUser.email || '',
                phone_number: parsedUser.phone_number || '',
                address: parsedUser.address || ''
            });
        }

        // Load giỏ hàng từ backend
        this.cartService.loadCart().subscribe({
            next: (items) => {
                this.cartItems = items.map(item => ({
                  product: {
                    id: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    thumbnail: `${environment.apiBaseUrl}products/images/${item.product.thumbnail}`,
                  } as Product,
                  quantity: item.quantity
                }));
                this.calculateTotal();
            },
            error: (error) => console.error('Error loading cart:', error)
        });
    }

    placeOrder(): void {
        console.log("CLICK DAT HANG");

        if (this.orderForm.valid) {

            this.orderData = {
                ...this.orderData,
                ...this.orderForm.value
            };

            console.log("FORM VALUE:", this.orderForm.value);

            this.orderData.cart_items = this.cartItems.map(item => ({
                product_id: item.product.id,
                quantity: item.quantity
            }));

            this.orderData.total_money = this.totalAmount;

            this.orderService.placeOrder(this.orderData).subscribe({

                next: (response: Order) => {

                    console.log("ORDER RESPONSE:", response);

                    const paymentMethod =
                        this.orderForm.get('payment_method')?.value;

                    console.log("PAYMENT METHOD:", paymentMethod);

                    if (paymentMethod === 'VNPAY') {

                        console.log("GO VNPAY");

                        this.http.post(
                            `${environment.apiBaseUrl}payment/create-payment?orderId=${response.id}`,
                            {}
                        ).subscribe({

                            next: (res: any) => {
                                console.log("VNPAY RESPONSE:", res);

                                window.location.href = res.paymentUrl;
                            },

                            error: (err) => {
                                console.log("VNPAY ERROR:", err);
                            }
                        });

                    } else {

                        alert('Đặt hàng thành công');

                        this.cartService.clearCart();

                        this.router.navigate(['/']);
                    }
                },

                error: (error) => {
                    console.log("ORDER ERROR:", error);
                    alert('Lỗi: ' + error?.error?.message);
                }
            });
        }
    }

    calculateTotal(): void {
        this.totalAmount = this.cartItems.reduce(
            (total, item) => total + item.product.price * item.quantity,
            0
        );
    }

    increaseItem(productId: number): void {
        const item = this.cartItems.find(x => x.product.id === productId);
        if (!item) return;

        item.quantity++;
        this.cartService.addToCart(productId, 1).subscribe();
        this.calculateTotal();
    }

    decreaseItem(productId: number): void {
        const item = this.cartItems.find(x => x.product.id === productId);
        if (!item) return;

        if (item.quantity > 1) {
            item.quantity--;
            this.cartService.updateQuantity(productId, item.quantity).subscribe();
        } else {
            this.removeItem(productId);
        }
        this.calculateTotal();
    }

    removeItem(productId: number): void {
        this.cartItems = this.cartItems.filter(x => x.product.id !== productId);
        this.cartService.removeFromCart(productId).subscribe();
        this.calculateTotal();
    }

    applyCoupon(): void {
        // TODO: implement coupon logic
    }
}