package com.otabek.nexus.dto.request;

import lombok.Data;

@Data
public class AddToCartDTO {
    private Long productId;
    private int quantity;
}