package com.otabek.nexus.dto.request;


import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class OrderRequestDTO {
    private long userId;
    private List<OrderItemRequestDTO> orderItems;
    private String shippingAddress;
    private Map<String, String> paymentInfo; // Contains cardNumber, expiryDate, cvv, cardName
    private String status; // For updating order status
}