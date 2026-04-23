package com.project.shopapp.services;

import com.project.shopapp.dtos.CartItemDTO;
import com.project.shopapp.models.Cart;
import com.project.shopapp.models.CartItem;
import com.project.shopapp.models.User;
import java.util.List;

public interface ICartService {

    // lấy hoặc tạo cart theo user
    Cart getCartByUser(User user);

    // thêm sản phẩm vào cart
    Cart addItemToCart(User user, CartItemDTO cartItemDTO);

    // lấy danh sách item trong cart
    List<CartItem> getCartItems(User user);

    // xóa 1 sản phẩm khỏi cart
    void removeItem(User user, Long productId);

    // update số lượng
    Cart updateItem(User user, CartItemDTO cartItemDTO);
}
