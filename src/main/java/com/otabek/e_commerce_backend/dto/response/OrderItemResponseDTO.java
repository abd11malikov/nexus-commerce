package com.otabek.e_commerce_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;

@Data
@Builder
public class OrderItemResponseDTO {
    private Long id;
    private int quantity;
    private BigDecimal price;
    private long orderId;
    private long productId;
}
