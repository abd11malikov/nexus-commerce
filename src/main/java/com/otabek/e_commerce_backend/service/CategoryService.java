package com.otabek.e_commerce_backend.service;

import com.otabek.e_commerce_backend.dto.request.CategoryRequestDTO;
import com.otabek.e_commerce_backend.dto.response.CategoryResponseDTO;
import com.otabek.e_commerce_backend.entity.Category;
import com.otabek.e_commerce_backend.repository.CategoryRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository categoryRepository;

    public CategoryResponseDTO create(CategoryRequestDTO requestDTO){
//        categoryRepository.findCategoryByName(requestDTO.getName()).orElseThrow(()->new RuntimeException("There is category by this name!"));
        Category category = mapToEntity(requestDTO);
        Category save = categoryRepository.save(category);
        return mapToResponseDTO(save);
    }

    private CategoryResponseDTO mapToResponseDTO(Category save) {
        CategoryResponseDTO build = CategoryResponseDTO.builder()
                .id(save.getId())
                .username(save.getName())
                .build();
        List<Long> productsId = new ArrayList<>();
        save.getProducts().forEach(product -> productsId.add(product.getId()));
        build.setProductsId(productsId);
        return build;
    }

    private Category mapToEntity(CategoryRequestDTO requestDTO) {
        return Category.builder()
                .name(requestDTO.getName())
                .products(new ArrayList<>())
                .build();
    }

    public void delete(Long id){
        Category category = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Category Not Found"));
        categoryRepository.delete(category);
    }
    public CategoryResponseDTO get(Long id){
        Category category = categoryRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Category is not found by this id" + id));
        return mapToResponseDTO(category);
    }

    public List<CategoryResponseDTO> getAll(){
        List<Category> all = categoryRepository.findAll();
        List<CategoryResponseDTO> categoryResponseDTOS = new ArrayList<>();
        all.forEach(category -> {
            categoryResponseDTOS.add(mapToResponseDTO(category));
        });

        return categoryResponseDTOS;
    }
}
