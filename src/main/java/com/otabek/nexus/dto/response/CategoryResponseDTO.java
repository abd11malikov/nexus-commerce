package com.otabek.nexus.dto.response;

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
    private String name;
    private List<Long> productsId;
}
