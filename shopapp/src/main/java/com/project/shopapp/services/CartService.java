package com.project.shopapp.services;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.models.Cart;
import com.project.shopapp.models.CartItem;
import com.project.shopapp.models.Product;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.CartItemRepository;
import com.project.shopapp.repositories.CartRepository;
import com.project.shopapp.repositories.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService implements ICartService {

    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;

    @Override
    public Cart getCartByUser(User user) {
        return cartRepository.findByUser(user)
                .orElseGet(() -> {
                    Cart newCart = Cart.builder()
                            .user(user)
                            .build();
                    return cartRepository.save(newCart);
                });
    }

    @Override
    public Cart addItemToCart(User user, CartItemDTO cartItemDTO) {

        if (cartItemDTO.getQuantity() <= 0) {
            throw new RuntimeException("Quantity must be greater than 0");
        }

        Cart cart = getCartByUser(user);

        CartItem existingItem = cartItemRepository
                .findByCartAndProduct_Id(cart, cartItemDTO.getProductId())
                .orElse(null);

        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + cartItemDTO.getQuantity());
            cartItemRepository.save(existingItem);
        } else {
            Product product = productRepository.findById(cartItemDTO.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            CartItem newItem = CartItem.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(cartItemDTO.getQuantity())
                    .build();

            cartItemRepository.save(newItem);
        }

        return cart;
    }

    @Override
    public List<CartItem> getCartItems(User user) {
        Cart cart = getCartByUser(user);
        return cartItemRepository.findByCart(cart);
    }

    @Override
    public void removeItem(User user, Long productId) {
        Cart cart = getCartByUser(user);

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository
                .findByCartAndProduct_Id(cart, productId)
                .orElseThrow(() -> new RuntimeException("Item not found"));

        cartItemRepository.delete(item);
    }

    // 🔹 Update quantity
    @Override
    public Cart updateItem(User user, CartItemDTO dto) {
        Cart cart = getCartByUser(user);

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        CartItem item = cartItemRepository
                .findByCartAndProduct_Id(cart, dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Item not found"));

        if (dto.getQuantity() <= 0) {
            cartItemRepository.delete(item);
        } else {
            item.setQuantity(dto.getQuantity());
            cartItemRepository.save(item);
        }

        return cart;
    }
}