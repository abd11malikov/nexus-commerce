package com.otabek.nexus.service;

import com.otabek.nexus.dto.request.ProductRequestDTO;
import com.otabek.nexus.dto.response.ProductResponseDTO;
import com.otabek.nexus.entity.Category;
import com.otabek.nexus.entity.Product;
import com.otabek.nexus.repository.CategoryRepository;
import com.otabek.nexus.repository.ProductRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @Transactional
    public ProductResponseDTO create(ProductRequestDTO requestDTO) {
        Product product = mapToEntity(requestDTO);
        Product savedProduct = productRepository.save(product);
        return mapToResponse(savedProduct);
    }

    public ProductResponseDTO getById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));
        return mapToResponse(product);
    }

    public List<ProductResponseDTO> getAll() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductResponseDTO update(Long id, ProductRequestDTO requestDTO) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product not found with id: " + id));

        product.setName(requestDTO.getName());
        product.setDescription(requestDTO.getDescription());
        product.setPrice(requestDTO.getPrice());
        product.setStockQuantity(requestDTO.getStockQuantity());
        product.setImageUrl(requestDTO.getImageUrl());

        Product updatedProduct = productRepository.save(product);
        return mapToResponse(updatedProduct);
    }

    @Transactional
    public void delete(Long id) {
        if (!productRepository.existsById(id)) {
            throw new EntityNotFoundException("Product not found with id: " + id);
        }
        productRepository.deleteById(id);
    }

    private Product mapToEntity(ProductRequestDTO requestDTO) {
        Category category = categoryRepository.findById(requestDTO.getCategoryId()).orElseThrow(() -> new EntityNotFoundException("Category not found"));
        return Product.builder()
                .name(requestDTO.getName())
                .description(requestDTO.getDescription())
                .price(requestDTO.getPrice())
                .stockQuantity(requestDTO.getStockQuantity())
                .imageUrl(requestDTO.getImageUrl())
                .active(true)
                .category(category)
                .build();
    }

    private ProductResponseDTO mapToResponse(Product product) {
        return ProductResponseDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stockQuantity(product.getStockQuantity())
                .imageUrl(product.getImageUrl())
                .active(product.isActive())
                .categoryId(product.getCategory().getId())
                .build();
    }

    public List<ProductResponseDTO> getAllByCategoryId(Long id){
        List<ProductResponseDTO> productResponseDTOS = new ArrayList<>();
        productRepository.findAllByCategoryId(id).forEach(product -> {
            productResponseDTOS.add(mapToResponse(product));
        });
        return productResponseDTOS;
    }
}