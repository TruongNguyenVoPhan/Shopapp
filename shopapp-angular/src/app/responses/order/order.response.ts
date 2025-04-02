import { OrderDetail } from "../../models/order.detail";
export interface OrderResponse{
    id: number;
    user_id: number;
    product_id: number;
    quantity: number;
    total_price: number;
    order_date: Date;
    status: string;
    total_money: number;
    shipping_method: string;
    shipping_address: string;
    shipping_date: Date;
    payment_method: string;
    order_Details: OrderDetail[];
}