package com.otabek.e_commerce_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
public class ProductRequestDTO {
    @NotBlank
    private String name;

    private String description;

    private int stockQuantity;

    private String imageUrl;

    private BigDecimal price;

    private Long categoryId;
}
