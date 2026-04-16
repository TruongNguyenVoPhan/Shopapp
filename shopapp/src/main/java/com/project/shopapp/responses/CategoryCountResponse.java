package com.project.shopapp.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CategoryCountResponse {

    private Long id;
    private String name;

    @JsonProperty("product_count")
    private Integer productCount;
}