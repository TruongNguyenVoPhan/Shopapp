// package com.project.shopapp.services;

// import lombok.RequiredArgsConstructor;
// import org.springframework.mail.SimpleMailMessage;
// import org.springframework.mail.javamail.JavaMailSender;
// import org.springframework.stereotype.Service;

// @Service
// @RequiredArgsConstructor
// public class EmailService {

//     private final JavaMailSender mailSender;

//     public void sendOtpEmail(String toEmail, String otpCode) {
//         SimpleMailMessage message = new SimpleMailMessage();
//         message.setTo(toEmail);
//         message.setSubject("ShopApp - Mã xác minh tài khoản");
//         message.setText(
//             "Xin chào!\n\n" +
//             "Mã OTP xác minh tài khoản của bạn là:\n\n" +
//             "  " + otpCode + "\n\n" +
//             "Mã có hiệu lực trong 5 phút.\n" +
//             "Nếu bạn không yêu cầu, hãy bỏ qua email này.\n\n" +
//             "ShopApp Team"
//         );
//         // mailSender.send(message);
//         try {
//             mailSender.send(message);
//             System.out.println("EMAIL SENT SUCCESS");
//         } catch (Exception e) {
//             e.printStackTrace();
//             throw e;
//         }
//     }
// }
package com.project.shopapp.services;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${brevo.sender.email}")
    private String senderEmail;

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendOtpEmail(String toEmail, String otpCode) {
        System.out.println("DEBUG >>> Brevo API key length = " + (brevoApiKey == null ? "NULL" : brevoApiKey.length()));
        System.out.println("DEBUG >>> Brevo API key preview = " + (brevoApiKey == null ? "NULL" : 
            (brevoApiKey.length() > 10 ? brevoApiKey.substring(0,6) + "..." + brevoApiKey.substring(brevoApiKey.length()-4) : brevoApiKey)));
        System.out.println("DEBUG >>> Sender email = " + senderEmail);
        String url = "https://api.brevo.com/v3/smtp/email";

        Map<String, Object> body = new HashMap<>();
        Map<String, String> sender = new HashMap<>();
        sender.put("name", "ShopApp");
        sender.put("email", senderEmail);
        body.put("sender", sender);

        Map<String, String> toRecipient = new HashMap<>();
        toRecipient.put("email", toEmail);
        body.put("to", List.of(toRecipient));

        body.put("subject", "ShopApp - Mã xác minh tài khoản");
        body.put("htmlContent",
            "<p>Xin chào!</p>"
            + "<p>Mã OTP xác minh tài khoản của bạn là: <b>" + otpCode + "</b></p>"
            + "<p>Mã có hiệu lực trong 5 phút.</p>"
            + "<p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>"
            + "<p>ShopApp Team</p>"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            restTemplate.postForEntity(url, request, String.class);
            System.out.println("EMAIL SENT SUCCESS via Brevo");
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            System.out.println("DEBUG >>> Brevo response body: " + e.getResponseBodyAsString());
            e.printStackTrace();
            throw new RuntimeException("Gửi email thất bại: " + e.getResponseBodyAsString());
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Gửi email thất bại: " + e.getMessage());
        }
    }
}