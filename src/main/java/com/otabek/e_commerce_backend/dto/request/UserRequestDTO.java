package com.otabek.e_commerce_backend.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class UserRequestDTO {
    @NotBlank
    private String username;

    @NotBlank
    private String firstName;

    private String lastName;

    @NotBlank(message = "Phone number needed")
    private String phone;

    @NotBlank(message = "Password is mandatory")
    private String password;

    @NotBlank(message = "Email is required")
    @Email
    private String email;

}
