package com.otabek.e_commerce_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@AllArgsConstructor
@Setter
@Getter
public class CategoryResponseDTO {
    private Long id;
    private String username;
    private List<Long> productsId;
}
