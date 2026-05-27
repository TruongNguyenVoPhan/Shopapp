package com.project.shopapp.controller;

import com.project.shopapp.models.Order;
import com.project.shopapp.models.OrderStatus;
import com.project.shopapp.repositories.OrderRepository;
import com.project.shopapp.services.VNPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("${api.prefix}/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final VNPayService vnPayService;
    private final OrderRepository orderRepository;

    @PostMapping("/create-payment")
    public ResponseEntity<?> createPayment(
            @RequestParam Long orderId,
            HttpServletRequest request) {
        try {
            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Không tìm thấy đơn hàng"));

            String ipAddr = request.getRemoteAddr();
            String orderInfo = "Thanh toan don hang " + orderId;
            if (order.getTotalMoney() == null) {
                throw new Exception("Order total money is null");
            }

            long amount = order.getTotalMoney().longValueExact();

            String paymentUrl = vnPayService.createPaymentUrl(
                orderId, amount, orderInfo, ipAddr
            );

            Map<String, String> response = new HashMap<>();
            response.put("paymentUrl", paymentUrl);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();

            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());

            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/vnpay-return")
    public ResponseEntity<?> vnpayReturn(
            @RequestParam Map<String, String> params) {
        try {
            boolean isValid = vnPayService.verifyPayment(params);

            if (!isValid) {
                return ResponseEntity.badRequest().body("Chữ ký không hợp lệ");
            }

            String responseCode = params.get("vnp_ResponseCode");
            String txnRef = params.get("vnp_TxnRef");

            Long orderId = Long.parseLong(txnRef.split("_")[0]);

            Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new Exception("Không tìm thấy đơn hàng"));

            if ("00".equals(responseCode)) {
                order.setStatus(OrderStatus.PROCESSING);
                orderRepository.save(order);
                return ResponseEntity.status(302)
                    .header("Location", "http://localhost:4200/orders/" + orderId + "?payment=success")
                    .build();
            } else {
                order.setStatus(OrderStatus.CANCELLED);
                orderRepository.save(order);
                return ResponseEntity.status(302)
                    .header("Location", "http://localhost:4200/orders/" + orderId + "?payment=failed")
                    .build();
            }

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}