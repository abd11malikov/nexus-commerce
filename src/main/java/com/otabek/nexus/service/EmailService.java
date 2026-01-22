package com.otabek.nexus.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendOrderDeliveredEmail(String toEmail, String username, Long orderId) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("📦 Your Order #" + orderId + " is Delivered!");

            String htmlContent = "<h1>Hi " + username + "!</h1>"
                    + "<p>Great news! Your order <strong>#" + orderId + "</strong> has been delivered.</p>"
                    + "<p>It was sent to your registered address.</p>"
                    + "<p>Thank you for choosing Nexus Commerce.</p>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Email sent successfully to " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Failed to send email: " + e.getMessage());
        }
    }
}