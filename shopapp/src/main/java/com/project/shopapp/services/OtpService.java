package com.project.shopapp.services;

import com.project.shopapp.exceptions.DataNotFoundException;
import com.project.shopapp.models.Otp;
import com.project.shopapp.models.User;
import com.project.shopapp.repositories.OtpRepository;
import com.project.shopapp.repositories.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Random;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final UserRepository userRepository;
    private final EmailService emailService; 
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void generateAndSendOtp(String email) throws DataNotFoundException {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với email: " + email));

        otpRepository.deleteByUser(user);

        String otpCode = String.format("%06d", new Random().nextInt(999999));

        Otp otp = Otp.builder()
            .user(user)
            .otpCode(otpCode)
            .createdAt(LocalDateTime.now())
            .expiresAt(LocalDateTime.now().plusMinutes(5))
            .isUsed(false)
            .build();

        otpRepository.save(otp);

        emailService.sendOtpEmail(email, otpCode);
    }

    @Transactional
    public void verifyOtp(String email, String inputOtp) throws Exception {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user"));

        Otp otp = otpRepository
            .findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(user)
            .orElseThrow(() -> new Exception("OTP không hợp lệ hoặc đã được sử dụng"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new Exception("OTP đã hết hạn");
        }

        if (!otp.getOtpCode().equals(inputOtp)) {
            throw new Exception("OTP không đúng");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        user.setActive(true);
        userRepository.save(user);
    }

    @Transactional
    public void resetPassword(String email, String inputOtp, String newPassword) throws Exception {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new DataNotFoundException("Không tìm thấy user với email: " + email));

        Otp otp = otpRepository
            .findTopByUserAndIsUsedFalseOrderByCreatedAtDesc(user)
            .orElseThrow(() -> new Exception("OTP không hợp lệ hoặc đã được sử dụng"));

        if (otp.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new Exception("OTP đã hết hạn");
        }

        if (!otp.getOtpCode().equals(inputOtp)) {
            throw new Exception("OTP không đúng");
        }

        otp.setUsed(true);
        otpRepository.save(otp);

        String encoded = passwordEncoder.encode(newPassword);
        user.setPassword(encoded);
        userRepository.save(user);
    }
}