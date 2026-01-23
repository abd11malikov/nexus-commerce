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

    
    
    
    @Transactional
    public CartResponseDTO getCartAsDTO(Long userId) {
        
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

    
    
    
    @Transactional
    public void addToCart(Long userId, AddToCartDTO request) {
        Cart cart = getCart(userId);

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        
        if (product.getStockQuantity() < request.getQuantity()) {
            throw new RuntimeException("Not enough stock available!");
        }

        
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst();

        if (existingItem.isPresent()) {
            
            CartItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + request.getQuantity());
        } else {
            
            CartItem newItem = new CartItem();
            newItem.setCart(cart);
            newItem.setProduct(product);
            newItem.setQuantity(request.getQuantity());
            cart.getItems().add(newItem);
        }

        cartRepository.save(cart); 
    }

    
    
    
    @Transactional
    public void removeItem(Long userId, Long productId) {
        Cart cart = getCart(userId);

        
        cart.getItems().removeIf(item -> item.getProduct().getId().equals(productId));

        cartRepository.save(cart);
    }

    
    
    
    @Transactional
    public void clearCart(Long userId) {
        Cart cart = getCart(userId);
        cart.getItems().clear(); 
        cartRepository.save(cart);
    }

    
    @Transactional
    public Cart getCart(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUserId(userId)
                .orElseGet(() -> createEmptyCart(user));
    }

    
    
    
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