package com.project.shopapp.models;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;

@Entity
@Table(name = "order_details")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(name = "price", nullable = false)
    private BigDecimal price;

    @Column(name = "number_of_product", nullable = false)
    private int numberOfProduct;

    @Column(name = "total_money", nullable = false)
    private BigDecimal totalMoney;

    @Column(name = "color")
    private String color;
}
