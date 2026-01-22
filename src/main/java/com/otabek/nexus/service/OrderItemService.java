package com.otabek.nexus.service;


import com.otabek.nexus.entity.OrderItem;
import com.otabek.nexus.repository.OrderItemRepository;
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
