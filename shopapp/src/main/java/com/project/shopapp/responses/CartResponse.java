package com.project.shopapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.models.Cart;
import com.project.shopapp.models.CartItem;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartResponse {

    @JsonProperty("cart_id")
    private Long cartId;

    @JsonProperty("user_id")
    private Long userId;

    @JsonProperty("items")
    private List<CartItemResponse> items;

    @JsonProperty("total_items")
    private int totalItems;

    @JsonProperty("total_money")
    private BigDecimal totalMoney;

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    public static class CartItemResponse {

        @JsonProperty("cart_item_id")
        private Long cartItemId;

        @JsonProperty("product_id")
        private Long productId;

        @JsonProperty("product_name")
        private String productName;

        @JsonProperty("thumbnail")
        private String thumbnail;

        @JsonProperty("price")
        private BigDecimal price;

        @JsonProperty("quantity")
        private int quantity;

        @JsonProperty("subtotal")
        private BigDecimal subtotal;
    }

    public static CartResponse fromCart(Cart cart, List<CartItem> items) {

        List<CartItemResponse> itemResponses = items.stream().map(item -> {
            BigDecimal price = item.getProduct().getPrice();
            int qty = item.getQuantity();
            BigDecimal subtotal = price.multiply(BigDecimal.valueOf(qty));

            return CartItemResponse.builder()
                    .cartItemId(item.getId())
                    .productId(item.getProduct().getId())
                    .productName(item.getProduct().getName())
                    .thumbnail(item.getProduct().getThumbnail())
                    .price(price)
                    .quantity(qty)
                    .subtotal(subtotal)
                    .build();
        }).collect(Collectors.toList());

        BigDecimal totalMoney = itemResponses.stream()
                .map(CartItemResponse::getSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = itemResponses.stream()
                .mapToInt(CartItemResponse::getQuantity)
                .sum();

        return CartResponse.builder()
                .cartId(cart.getId())
                .userId(cart.getUser().getId())
                .items(itemResponses)
                .totalItems(totalItems)
                .totalMoney(totalMoney)
                .build();
    }
}