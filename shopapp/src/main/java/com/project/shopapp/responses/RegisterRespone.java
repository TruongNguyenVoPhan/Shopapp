package com.project.shopapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.models.User;
import jakarta.persistence.MappedSuperclass;
import lombok.*;

@MappedSuperclass
@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRespone {
    @JsonProperty("message")
    private String message;

    @JsonProperty("user")
    private User user;
}
