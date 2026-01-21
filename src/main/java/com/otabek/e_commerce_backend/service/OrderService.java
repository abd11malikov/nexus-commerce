package com.otabek.e_commerce_backend.service;

import com.otabek.e_commerce_backend.dto.request.OrderItemRequestDTO;
import com.otabek.e_commerce_backend.dto.request.OrderRequestDTO;
import com.otabek.e_commerce_backend.dto.response.OrderItemResponseDTO;
import com.otabek.e_commerce_backend.dto.response.OrderResponseDTO;
import com.otabek.e_commerce_backend.entity.Order;
import com.otabek.e_commerce_backend.entity.OrderItem;
import com.otabek.e_commerce_backend.entity.Product;
import com.otabek.e_commerce_backend.entity.User;
import com.otabek.e_commerce_backend.enums.Status;
import com.otabek.e_commerce_backend.repository.OrderRepository;
import com.otabek.e_commerce_backend.repository.ProductRepository;
import com.otabek.e_commerce_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    @Transactional
    public OrderResponseDTO placeOrder(String email, OrderRequestDTO requestDTO) {
        User user = userRepository.findByEmail(email).orElseThrow(() ->
                new EntityNotFoundException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setStatus(Status.PENDING);

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
                .orderItems(itemDTOs)
                .build();
    }
}