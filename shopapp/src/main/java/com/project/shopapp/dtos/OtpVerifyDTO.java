package com.project.shopapp.dtos;

import lombok.*;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 
@Builder
public class OtpVerifyDTO {
    private String email;
    private String otp;
}