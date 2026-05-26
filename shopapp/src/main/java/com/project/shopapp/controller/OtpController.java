package com.project.shopapp.controller;

import com.project.shopapp.dtos.OtpRequestDTO;
import com.project.shopapp.dtos.OtpVerifyDTO;
import com.project.shopapp.services.OtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("${api.prefix}/otp")
@RequiredArgsConstructor
public class OtpController {

    private final OtpService otpService;

    // POST /api/v1/otp/send
    @PostMapping("/send")
    public ResponseEntity<?> sendOtp(@RequestBody OtpRequestDTO dto) {
        try {
            otpService.generateAndSendOtp(dto.getEmail());
            return ResponseEntity.ok("OTP đã được gửi đến email của bạn");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/v1/otp/verify
    @PostMapping("/verify")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerifyDTO dto) {
        try {
            otpService.verifyOtp(dto.getEmail(), dto.getOtp());
            return ResponseEntity.ok("Xác minh thành công! Bạn có thể đăng nhập.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}