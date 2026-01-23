package com.otabek.nexus.service;

import com.otabek.nexus.dto.request.OrderItemRequestDTO;
import com.otabek.nexus.dto.request.OrderRequestDTO;
import com.otabek.nexus.dto.response.OrderItemResponseDTO;
import com.otabek.nexus.dto.response.OrderResponseDTO;
import com.otabek.nexus.entity.Order;
import com.otabek.nexus.entity.OrderItem;
import com.otabek.nexus.entity.Product;
import com.otabek.nexus.entity.User;
import com.otabek.nexus.enums.Status;
import com.otabek.nexus.repository.OrderRepository;
import com.otabek.nexus.repository.ProductRepository;
import com.otabek.nexus.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final EmailService emailService;

    @Transactional
    public OrderResponseDTO placeOrder(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new EntityNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Status.PENDING);

        
        if (requestDTO.getShippingAddress() != null) {
            order.setShippingAddress(requestDTO.getShippingAddress());
        }

        
        if (requestDTO.getPaymentInfo() != null) {
            
            
        }

        List<OrderItem> orderItems = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;

        for (OrderItemRequestDTO itemRequest : requestDTO.getOrderItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new EntityNotFoundException("Product not found: " + itemRequest.getProductId()));

            if (product.getStockQuantity() < itemRequest.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity() - itemRequest.getQuantity());
            productRepository.save(product);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(itemRequest.getQuantity())
                    .price(product.getPrice())
                    .build();

            orderItems.add(orderItem);
            totalPrice = totalPrice.add(orderItem.getTotalPrice());
        }

        order.setOrderItems(orderItems);
        order.setTotalAmount(totalPrice);

        Order saved = orderRepository.save(order);
        return mapToResponse(saved);
    }
    public List<OrderResponseDTO> getAll() {
        return orderRepository.findAll().stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }


    public List<OrderResponseDTO> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));

        return orderRepository.findByUser(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public OrderResponseDTO getOrderById(Long id) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));

        return mapToResponse(order);
    }

    public OrderResponseDTO updateOrder(Long id, OrderRequestDTO requestDTO) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Order not found with id: " + id));

        if (requestDTO.getStatus() != null) {
            order.setStatus(Status.valueOf(requestDTO.getStatus()));
        }
        if (Objects.equals(requestDTO.getStatus(), "DELIVERED")){
            emailService.sendOrderDeliveredEmail(
                    order.getUser().getEmail(),
                    order.getUser().getUsername(),
                    order.getId()
            );
        }
        Order updated = orderRepository.save(order);
        return mapToResponse(updated);
    }

    private OrderResponseDTO mapToResponse(Order order) {

        List<OrderItemResponseDTO> itemDTOs = order.getOrderItems().stream()
                .map(item -> OrderItemResponseDTO.builder()
                        .id(item.getId())
                        .productId(item.getProduct().getId())
                        .quantity(item.getQuantity())
                        .price(item.getPrice())
                        .build())
                .collect(Collectors.toList());

        return OrderResponseDTO.builder()
                .id(order.getId())
                .userId(order.getUser().getId())
                .status(order.getStatus().name())
                .totalAmount(order.getTotalAmount())
                .createdAt(order.getCreatedAt())
                .orderItems(itemDTOs)
                .build();
    }
}