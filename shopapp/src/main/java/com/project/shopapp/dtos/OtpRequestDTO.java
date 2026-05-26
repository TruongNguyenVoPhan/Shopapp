package com.project.shopapp.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data 
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OtpRequestDTO {
    private String email;
}