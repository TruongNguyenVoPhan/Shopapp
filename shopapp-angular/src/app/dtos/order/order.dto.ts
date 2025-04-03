import {
    IsString,
    IsNotEmpty,IsNumber,
    IsPhoneNumber,arrayMinSize,
    IsDate,ValidateNested,
    Length
} from 'class-validator';
import { Type } from 'class-transformer';
import { CartItemDTO } from './cart.item.dto';
export class OrderDTO{
    user_id: number;

    fullname: string;

    email: string;

    phone_number: string;

    address: string;

    note: string;

    shipping_method: string;

    payment_method: string;

    coupon_code: string;

    cart_items: { product_id: number; quantity: number }[];

    total_money: number;

    constructor(data: any) {
        this.user_id = data.user_id;
        this.fullname = data.fullname;
        this.email = data.email;
        this.phone_number = data.phone_number;
        this.address = data.address;
        this.note = data.note;
        this.shipping_method = data.shipping_method;
        this.payment_method = data.payment_method;
        this.coupon_code = data.coupon_code;
        this.total_money = data.total_money;
        this.cart_items = data.cart_items.map((item: any) => new CartItemDTO(item));
    }
}