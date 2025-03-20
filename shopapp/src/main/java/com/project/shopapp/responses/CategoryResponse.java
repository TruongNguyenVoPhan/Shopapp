package com.project.shopapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.project.shopapp.models.Category;
import com.project.shopapp.models.User;
import jakarta.persistence.MappedSuperclass;
import lombok.*;

import java.util.List;

@MappedSuperclass
@Data//toString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryResponse {
    @JsonProperty("message")
    private String message;

    @JsonProperty("errors")
    private List<String> errors;

    @JsonProperty("category")
    private Category category;
}
