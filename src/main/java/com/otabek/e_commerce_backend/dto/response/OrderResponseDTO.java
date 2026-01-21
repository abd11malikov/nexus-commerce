package com.otabek.e_commerce_backend.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private long id;
    private String status;
    private BigDecimal amount;
    private long userId;
    private List<OrderItemResponseDTO> orderItems;
}
