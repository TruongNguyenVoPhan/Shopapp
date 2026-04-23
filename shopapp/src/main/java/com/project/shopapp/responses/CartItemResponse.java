package com.project.shopapp.dtos;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CartItemResponse {
    private Long productId;
    private String productName;
    private Double price;
    private Integer quantity;
}