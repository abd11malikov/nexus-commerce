package com.otabek.e_commerce_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
@Data
@AllArgsConstructor
@Builder
public class ProductResponseDTO {
    private Long id;

    private String name;

    private String description;

    private int stockQuantity;

    private String imageUrl;

    private BigDecimal price;

    private boolean active;
}
