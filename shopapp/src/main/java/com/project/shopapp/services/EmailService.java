package com.project.shopapp.services;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendOtpEmail(String toEmail, String otpCode) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("ShopApp - Mã xác minh tài khoản");
        message.setText(
            "Xin chào!\n\n" +
            "Mã OTP xác minh tài khoản của bạn là:\n\n" +
            "  " + otpCode + "\n\n" +
            "Mã có hiệu lực trong 5 phút.\n" +
            "Nếu bạn không yêu cầu, hãy bỏ qua email này.\n\n" +
            "ShopApp Team"
        );
        // mailSender.send(message);
        try {
            mailSender.send(message);
            System.out.println("EMAIL SENT SUCCESS");
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }
}