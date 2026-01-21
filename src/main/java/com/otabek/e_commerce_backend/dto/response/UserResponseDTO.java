package com.otabek.e_commerce_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
@Builder
public class UserResponseDTO {
    private long id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private String phone;

    private boolean enabled;

    private String role;

    private List<OrderResponseDTO> orders;
}
