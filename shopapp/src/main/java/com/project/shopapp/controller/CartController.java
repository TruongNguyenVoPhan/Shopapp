package com.project.shopapp.controller;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.models.User;
import com.project.shopapp.services.CartService;
import com.project.shopapp.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;
    private final UserService userService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(
            @RequestBody CartItemDTO dto,
            @RequestHeader("Authorization") String token
    ) throws Exception {

        User user = userService.getUseDetailsFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(cartService.addItemToCart(user, dto));
    }

    @GetMapping("")
    public ResponseEntity<?> getCart(
            @RequestHeader("Authorization") String token
    ) throws Exception {

        User user = userService.getUseDetailsFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(cartService.getCartItems(user));
    }

    @PutMapping("/update")
    public ResponseEntity<?> updateCart(
            @RequestBody CartItemDTO dto,
            @RequestHeader("Authorization") String token
    ) throws Exception {

        User user = userService.getUseDetailsFromToken(token.replace("Bearer ", ""));
        return ResponseEntity.ok(cartService.updateItem(user, dto));
    }

    @DeleteMapping("/item/{productId}")
    public ResponseEntity<?> removeItem(
            @PathVariable Long productId,
            @RequestHeader("Authorization") String token
    ) throws Exception {

        User user = userService.getUseDetailsFromToken(token.replace("Bearer ", ""));
        cartService.removeItem(user, productId);
        return ResponseEntity.ok("Deleted");
    }
}
