package com.otabek.nexus.service;

import com.otabek.nexus.dto.request.AddToCartDTO;
import com.otabek.nexus.dto.response.CartItemResponseDTO;
import com.otabek.nexus.dto.response.CartResponseDTO;
import com.otabek.nexus.dto.response.ProductResponseDTO;
import com.otabek.nexus.entity.*;
import com.otabek.nexus.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    // ==========================================
    // 1. GET CART (READ / CREATE) - Returns DTO
    // ==========================================
    @Transactional
    public CartResponseDTO getCartAsDTO(Long userId) {
        // If cart exists, return it. If not, CREATE a new one.
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Cart cart = cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(user));

        return mapCartToDTO(cart);
    }

    private Cart createEmptyCart(User user) {
        Cart cart = new Cart();
        cart.setUser(user);
        return cartRepository.save(cart);
    }

    // ==========================================
    // 2. ADD TO CART (CREATE / UPDATE)
    // ==========================================
    @Transactional
    public void addToCart(Long userId, AddToCartDTO request) {
        Cart cart = getCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Stock Check 🛡️
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock available!");
        }

        // SMART LOGIC: Does this product already exist in the cart?
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            // SCENARIO A: Item exists. Update quantity.
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            // SCENARIO B: New Item. Add it.
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart); // Cascade saves the items!
    }

    // ==========================================
    // 3. REMOVE ITEM (DELETE SPECIFIC)
    // ==========================================
    @Transactional
    public void removeItem(Long userId, Long productId) {
        Cart cart = getCart(userId);

        // RemoveIf is efficient for lists
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));

        cartRepository.save(cart);
    }

    // ==========================================
    // 4. CLEAR CART (DELETE ALL)
    // ==========================================
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear(); // Since orphanRemoval=true, this DELETES rows from DB
        cartRepository.save(cart);
    }

    // Helper method to get cart entity (used internally)
    @Transactional
    public Cart getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(user));
    }

    // ==========================================
    // MAPPER METHODS
    // ==========================================
    private CartResponseDTO mapCartToDTO(Cart cart) {
        List<CartItemResponseDTO> cartItemDTOs = new ArrayList<>();

        if (cart.getItems() != null) {
            for (CartItem item : cart.getItems()) {
                ProductResponseDTO productDTO = mapProductToDTO(item.getProduct());

                CartItemResponseDTO itemDTO = CartItemResponseDTO.builder()
                        .id(item.getId())
                        .quantity(item.getQuantity())
                        .product(productDTO)
                        .build();

                cartItemDTOs.add(itemDTO);
            }
        }

        return CartResponseDTO.builder()
                .id(cart.getId())
                .userId(cart.getUser().getId())
                .items(cartItemDTOs)
                .build();
    }

    private ProductResponseDTO mapProductToDTO(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .build();
    }
}