package com.otabek.e_commerce_backend.service;


import com.otabek.e_commerce_backend.entity.OrderItem;
import com.otabek.e_commerce_backend.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderItemService {
    private final OrderItemRepository orderItemRepository;

    public List<OrderItem> getAllSoldItems() {
        return orderItemRepository.findAll();
    }

}
