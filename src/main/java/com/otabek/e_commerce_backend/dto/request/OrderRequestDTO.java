package com.otabek.e_commerce_backend.dto.request;


import lombok.Data;

import java.util.List;
@Data
public class OrderRequestDTO {
    private long userId;
    private List<OrderItemRequestDTO> orderItems;
}