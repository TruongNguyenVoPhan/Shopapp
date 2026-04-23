export class CartItemDTO {
  product_id: number;
  quantity: number;

  constructor(productId: number, quantity: number) {
    this.product_id = productId;
    this.quantity = quantity;
  }
}