package com.otabek.e_commerce_backend.controller;

import com.otabek.e_commerce_backend.dto.request.OrderRequestDTO;
import com.otabek.e_commerce_backend.dto.response.OrderResponseDTO;
import com.otabek.e_commerce_backend.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAll(){
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders(@RequestParam String email){
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @PostMapping
    public ResponseEntity<OrderResponseDTO> placeOrder(@RequestBody OrderRequestDTO orderRequestDTO){
        // Get user email from authentication principal
        String email = org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication().getName();
        return ResponseEntity.status(201).body(orderService.placeOrder(email,orderRequestDTO));
    }
}
