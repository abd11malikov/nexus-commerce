package com.otabek.nexus.dto.response;

import com.otabek.nexus.entity.Product;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartItemResponseDTO {
    private Long id;
    private int quantity;
    private ProductResponseDTO product; // Use Product DTO instead of entity
}