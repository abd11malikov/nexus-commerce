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

    // Spring Boot automatically configures this using the properties in application.yml
    private final JavaMailSender mailSender;

    // This gets your sender email automatically from application.yml
    @Value("${spring.mail.username}")
    private String senderEmail;

    // Storefront base URL used for the "View your order" button. Override with
    // app.frontend-url in application.properties for prod; defaults to local dev.
    @Value("${app.frontend-url:http://localhost:8080}")
    private String frontendUrl;

    @Async
    public void sendOrderDeliveredEmail(String toEmail, String username, Long orderId) {
        try {
            // MimeMessage is required for sending HTML text
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject("📦 Your Order #" + orderId + " is Delivered!");

            String htmlContent = "<h1>Hi " + username + "!</h1><p>Your order is delivered! Thank you for choosing us)</p>";
            // "true" means Spring will parse the HTML tags properly!
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("✅ Native Java Email sent successfully to " + toEmail);

        } catch (MessagingException e) {
            System.err.println("❌ Native Java Email failed: " + e.getMessage());
        }
    }

    public void sendOrderCreatedEmail(String toEmail, String username, Long orderId, String shippingAddress) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject("Your Order #" + orderId + " is Confirmed");

            String htmlContent = buildOrderConfirmationEmail(username, orderId, shippingAddress);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            System.out.println("Order confirmation email sent to {} for order #{}"+ toEmail+ orderId);

        } catch (MessagingException e) {
            System.out.println("Failed to send order confirmation email for order #{}: {}"+ orderId+ e.getMessage()+ e);
        }
    }

    /**
     * Builds a responsive, email-client-safe HTML order confirmation.
     *
     * Notes for anyone editing this template:
     *  - Layout uses nested <table> elements + inline styles because email
     *    clients (esp. Outlook) don't support flexbox/grid or <head> CSS.
     *  - Gradients get a solid background-color fallback for Outlook.
     *  - It's a text block passed to String.formatted(), so EVERY literal '%'
     *    must be doubled ('%%'); dynamic values use positional args %1$..%5$.
     */
    private String buildOrderConfirmationEmail(String username, Long orderId, String shippingAddress) {
        String safeUsername = escapeHtml(username == null || username.isBlank() ? "there" : username);
        String safeAddress = escapeHtml(shippingAddress);
        // Show a multi-line address (commas are inserted by our own code, so this is safe post-escape).
        String formattedAddress = safeAddress.isBlank() ? "&mdash;" : safeAddress.replace(", ", "<br>");
        String orderUrl = frontendUrl.replaceAll("/+$", "") + "/profile.html";
        int year = java.time.Year.now().getValue();

        return """
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <meta name="x-apple-disable-message-reformatting">
          <title>Order Confirmation</title>
        </head>
        <body style="margin:0; padding:0; background-color:#f0f2f5; -webkit-font-smoothing:antialiased; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">

          <!-- Hidden preheader: sets the inbox preview text -->
          <div style="display:none; max-height:0; overflow:hidden; mso-hide:all; font-size:1px; line-height:1px; color:#f0f2f5;">
            Order #%2$d is confirmed and being prepared for shipment. Thank you for shopping with Nexus Commerce.
          </div>

          <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f0f2f5; padding:32px 12px;">
            <tr>
              <td align="center">

                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px; max-width:600px; background-color:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(15,23,42,0.06);">

                  <!-- Header (brand + status pill) -->
                  <tr>
                    <td style="background-color:#4f46e5; background-image:linear-gradient(135deg,#4f46e5 0%%,#7c3aed 100%%); padding:26px 40px;">
                      <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td>
                            <table role="presentation" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="width:40px; height:40px; background-color:rgba(255,255,255,0.16); border-radius:11px; text-align:center; vertical-align:middle;">
                                  <span style="color:#ffffff; font-size:20px; font-weight:700; line-height:40px;">N</span>
                                </td>
                                <td style="padding-left:12px; vertical-align:middle;">
                                  <span style="color:#ffffff; font-size:18px; font-weight:700; letter-spacing:-0.2px;">Nexus Commerce</span>
                                </td>
                              </tr>
                            </table>
                          </td>
                          <td align="right" style="vertical-align:middle;">
                            <span style="background-color:#22c55e; color:#ffffff; font-size:11px; font-weight:700; letter-spacing:0.6px; padding:6px 14px; border-radius:20px;">CONFIRMED</span>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Hero: success check + headline -->
                  <tr>
                    <td style="padding:44px 40px 4px 40px; text-align:center;">
                      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto 20px auto;">
                        <tr>
                          <td style="width:64px; height:64px; background-color:#ecfdf5; border-radius:50%%; text-align:center; vertical-align:middle;">
                            <span style="color:#16a34a; font-size:32px; line-height:64px;">&#10003;</span>
                          </td>
                        </tr>
                      </table>
                      <h1 style="margin:0 0 8px 0; font-size:24px; font-weight:800; color:#0f172a; letter-spacing:-0.4px;">Order confirmed</h1>
                      <p style="margin:0; font-size:15px; line-height:1.6; color:#64748b;">
                        Thanks, %1$s &mdash; we've received your order and it's being prepared for shipment.
                      </p>
                    </td>
                  </tr>

                  <!-- Order summary card -->
                  <tr>
                    <td style="padding:28px 40px 4px 40px;">
                      <table role="presentation" width="100%%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border:1px solid #e2e8f0; border-radius:12px;">
                        <tr>
                          <td style="padding:22px 24px;">
                            <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                              <tr>
                                <td style="font-size:11px; font-weight:700; letter-spacing:1px; color:#94a3b8; padding-bottom:6px;">ORDER NUMBER</td>
                              </tr>
                              <tr>
                                <td style="font-size:20px; font-weight:700; color:#0f172a; padding-bottom:20px;">#%2$d</td>
                              </tr>
                              <tr>
                                <td style="border-top:1px solid #e2e8f0; padding-top:18px; font-size:11px; font-weight:700; letter-spacing:1px; color:#94a3b8;">SHIPPING TO</td>
                              </tr>
                              <tr>
                                <td style="padding-top:6px; font-size:15px; line-height:1.6; color:#334155;">%3$s</td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Status tracker -->
                  <tr>
                    <td style="padding:26px 40px 6px 40px;">
                      <table role="presentation" width="100%%" cellpadding="0" cellspacing="0">
                        <tr>
                          <td width="25%%" align="center" style="font-size:12px; font-weight:600; color:#4f46e5;">
                            <div style="width:14px; height:14px; background-color:#4f46e5; border-radius:50%%; margin:0 auto 8px auto;"></div>
                            Confirmed
                          </td>
                          <td width="25%%" align="center" style="font-size:12px; color:#94a3b8;">
                            <div style="width:14px; height:14px; background-color:#e2e8f0; border-radius:50%%; margin:0 auto 8px auto;"></div>
                            Processing
                          </td>
                          <td width="25%%" align="center" style="font-size:12px; color:#94a3b8;">
                            <div style="width:14px; height:14px; background-color:#e2e8f0; border-radius:50%%; margin:0 auto 8px auto;"></div>
                            Shipped
                          </td>
                          <td width="25%%" align="center" style="font-size:12px; color:#94a3b8;">
                            <div style="width:14px; height:14px; background-color:#e2e8f0; border-radius:50%%; margin:0 auto 8px auto;"></div>
                            Delivered
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- CTA -->
                  <tr>
                    <td style="padding:26px 40px 40px 40px; text-align:center;">
                      <table role="presentation" cellpadding="0" cellspacing="0" align="center" style="margin:0 auto;">
                        <tr>
                          <td align="center" style="border-radius:10px; background-color:#4f46e5; background-image:linear-gradient(135deg,#4f46e5 0%%,#7c3aed 100%%);">
                            <a href="%4$s" target="_blank" style="display:inline-block; padding:14px 34px; font-size:15px; font-weight:600; color:#ffffff; text-decoration:none;">View your order &rarr;</a>
                          </td>
                        </tr>
                      </table>
                      <p style="margin:22px 0 0 0; font-size:13px; line-height:1.7; color:#94a3b8;">
                        You'll get another email with tracking as soon as your package ships.<br>
                        Questions? Just reply to this email &mdash; we're happy to help.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background-color:#f8fafc; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
                      <p style="margin:0 0 4px 0; font-size:13px; font-weight:700; color:#475569;">Nexus Commerce</p>
                      <p style="margin:0; font-size:12px; color:#94a3b8;">&copy; %5$d Nexus Commerce. All rights reserved.</p>
                    </td>
                  </tr>

                </table>

                <p style="margin:16px 0 0 0; font-size:11px; color:#b6bfcc;">You're receiving this email because you placed an order at Nexus Commerce.</p>

              </td>
            </tr>
          </table>
        </body>
        </html>
        """.formatted(safeUsername, orderId, formattedAddress, orderUrl, year);
    }

    private String escapeHtml(String input) {
        if (input == null) return "";
        return input
                .replace("&", "&amp;")
                .replace("<", "&lt;")
                .replace(">", "&gt;")
                .replace("\"", "&quot;")
                .replace("'", "&#39;");
    }
}