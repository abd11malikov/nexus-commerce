package com.otabek.nexus.controller;

import com.otabek.nexus.dto.request.AddToCartDTO;
import com.otabek.nexus.dto.response.CartResponseDTO;
import com.otabek.nexus.service.CartService;
import com.otabek.nexus.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/cart")
@RequiredArgsConstructor
public class CartController {

    private final UserService userService;
    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartResponseDTO> getMyCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserByUsername(userDetails.getUsername()).getId();
        return ResponseEntity.ok(cartService.getCartAsDTO(userId));
    }

    @PostMapping("/add")
    public ResponseEntity<String> addToCart(@AuthenticationPrincipal UserDetails userDetails,
                                            @RequestBody AddToCartDTO dto) {
        Long userId = userService.getUserByUsername(userDetails.getUsername()).getId();
        cartService.addToCart(userId, dto);
        return ResponseEntity.ok("Item added to cart!");
    }

    @DeleteMapping("/item/{productId}")
    public ResponseEntity<String> removeItem(@AuthenticationPrincipal UserDetails userDetails,
                                             @PathVariable Long productId) {
        Long userId = userService.getUserByUsername(userDetails.getUsername()).getId();
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Item removed from cart!");
    }

    @DeleteMapping("/clear")
    public ResponseEntity<String> clearCart(@AuthenticationPrincipal UserDetails userDetails) {
        Long userId = userService.getUserByUsername(userDetails.getUsername()).getId();
        cartService.clearCart(userId);
        return ResponseEntity.ok("Cart cleared!");
    }
}
