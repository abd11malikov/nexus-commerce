package com.otabek.nexus.controller;

import com.otabek.nexus.dto.request.CategoryRequestDTO;
import com.otabek.nexus.dto.response.CategoryResponseDTO;
import com.otabek.nexus.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Controller
@RequestMapping("api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("")
    public ResponseEntity<List<CategoryResponseDTO>> getAll() {
        return ResponseEntity.ok().body(categoryService.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponseDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.get(id));
    }

    @PutMapping("")
    public ResponseEntity<CategoryResponseDTO> create(@RequestBody CategoryRequestDTO categoryRequestDTO) {
        return ResponseEntity.status(201).body(categoryService.create(categoryRequestDTO));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        return ResponseEntity.status(200).body("Deleted Successfully");
    }
}
