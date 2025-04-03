package com.project.shopapp.controller;

import com.project.shopapp.components.LocalizationUtils;
import com.project.shopapp.dtos.*;
import com.project.shopapp.models.Order;
import com.project.shopapp.responses.OrderResponse;
import com.project.shopapp.services.IOrderService;
import com.project.shopapp.services.OrderService;
import com.project.shopapp.ultils.MessageKeys;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("${api.prefix}/orders")
public class Ordercontroller {
    private final IOrderService orderService;
    private final LocalizationUtils localizationUtils;
    @PostMapping("")
    public ResponseEntity<?> createorder
            (@RequestBody @Valid OrderDTO orderDTO,
             BindingResult result){
        try{
            if (result.hasErrors()){
                List<String> errorMessages = result.getFieldErrors()
                        .stream()
                        .map(FieldError::getDefaultMessage)
                        .toList();
                return ResponseEntity.badRequest().body(errorMessages);
            }
            Order orderResponse = orderService.createOrder(orderDTO);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/user/{user_id}")//Them duong dan user_id
    //Get http://localhost:8888/api/v1/orders/4
    public ResponseEntity<?> getOrders(@Valid @PathVariable("user_id")Long userId){
        try {
            List<Order> orders = orderService.findByUserId(userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrder(@Valid @PathVariable("id") Long orderId){
        try {
            Order existingOrder = orderService.getOrder(orderId);
            OrderResponse orderResponse = OrderResponse.fromOrder(existingOrder);
            return ResponseEntity.ok(orderResponse);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    //PUT http://localhost:8888/api/v1/orders/1
    //Cong viec cua admin
    public ResponseEntity<?> updateOrder(
            @Valid @PathVariable long id,
            @Valid @RequestBody OrderDTO orderDTO){
        try {
            Order order =  orderService.updateOrder(id,orderDTO);
            return ResponseEntity.ok(order);
        } catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(
            @Valid @PathVariable long id){
        //xoa mem => cap nhat trong active = false
        orderService.deleteOrder(id);
        return ResponseEntity.ok("Order deleted  successfully");
    }
}
