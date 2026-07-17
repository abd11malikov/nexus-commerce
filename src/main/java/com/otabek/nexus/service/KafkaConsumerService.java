package com.otabek.nexus.service;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
public class KafkaConsumerService {

    private final EmailService emailService;

    public KafkaConsumerService(EmailService emailService) {
        this.emailService = emailService;
    }

    @KafkaListener(topics = "order-topic", groupId = "nexus-ecommerce-group")
    public void consumeOrderEvent(String message) {
        System.out.println("KAFKA CONSUMER: Received order message -> " + message);

        try {
            String[] parts = message.split(":");
            String email = parts[0];
            String username = parts[1];
            Long orderId = Long.parseLong(parts[2]);
            String shippingAddress = parts[3];
            emailService.sendOrderCreatedEmail(email,username, orderId, shippingAddress);

        } catch (Exception e) {
            System.err.println("Error parsing Kafka message: " + e.getMessage());
        }
    }
}