package com.project.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResetPasswordDTO {
    private String email;
    private String otp;

    @JsonProperty("new_password")
    private String newPassword;
}