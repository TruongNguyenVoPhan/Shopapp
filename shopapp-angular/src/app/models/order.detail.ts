import { Product } from './product';
import { Order } from './order';
export interface OrderDetail {
    id: number;
    order: Order;
    product: Product;
    price: number;
    numble_of_product: number;
    total_money: number;
    color?: string; // Dấu "?" cho biết thuộc tính này là tùy chọn
}