package com.project.shopapp.repositories;

import com.project.shopapp.models.Cart;
import com.project.shopapp.models.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    Optional<CartItem> findByCartAndProduct_Id(Cart cart, Long productId);
    List<CartItem> findByCart(Cart cart);
}
