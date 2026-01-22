package com.otabek.nexus.dto.response;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class OrderResponseDTO {
    private long id;
    private String status;
    private BigDecimal totalAmount;
    private long userId;
    private LocalDateTime createdAt;
    private List<OrderItemResponseDTO> orderItems;
}
