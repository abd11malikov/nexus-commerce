package com.otabek.nexus.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private String apiKey = "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";

    private final RestTemplate restTemplate = new RestTemplate();

    @Async
    public void sendOrderDeliveredEmail(String toEmail, String username, Long orderId) {
        String url = "https://api.brevo.com/v3/smtp/email";

        Map<String, Object> requestBody = Map.of(
                "sender", Map.of("name", "Nexus Shop", "email", "jasonalexamiller@gmail.com"),
                "to", List.of(Map.of("email", toEmail, "name", username)),
                "subject", "📦 Your Order #" + orderId + " is Delivered!",
                "htmlContent", "<h1>Hi " + username + "!</h1><p>Your order is delivered! Thank you for choosing us)</p>"
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("api-key", apiKey);

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                System.out.println("✅ API Email sent successfully!");
            }
        } catch (Exception e) {
            System.err.println("❌ API Email failed: " + e.getMessage());
        }
    }
}