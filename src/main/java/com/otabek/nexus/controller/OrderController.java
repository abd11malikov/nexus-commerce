package com.otabek.nexus.controller;

import com.otabek.nexus.dto.request.OrderRequestDTO;
import com.otabek.nexus.dto.response.OrderResponseDTO;
import com.otabek.nexus.service.OrderService;
import com.otabek.nexus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {
    private final OrderService orderService;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<OrderResponseDTO>> getAll(){
        return ResponseEntity.ok(orderService.getAll());
    }

    @GetMapping("/user")
    public ResponseEntity<List<OrderResponseDTO>> getUserOrders(@RequestParam String email){
        return ResponseEntity.ok(orderService.getUserOrders(email));
    }

    @PostMapping("/create")
    public ResponseEntity<OrderResponseDTO> placeOrder(@AuthenticationPrincipal UserDetails userDetails,@RequestBody OrderRequestDTO orderRequestDTO){
        String email = userService.getUserByUsername(userDetails.getUsername()).getEmail();
        return ResponseEntity.status(201).body(orderService.placeOrder(email,orderRequestDTO));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> getOrderById(@PathVariable Long id){
        return ResponseEntity.ok(orderService.getOrderById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderResponseDTO> updateOrder(@PathVariable Long id, @RequestBody OrderRequestDTO orderRequestDTO){
        return ResponseEntity.ok(orderService.updateOrder(id, orderRequestDTO));
    }
}
