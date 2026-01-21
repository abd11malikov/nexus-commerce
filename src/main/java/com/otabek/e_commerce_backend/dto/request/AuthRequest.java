package com.otabek.e_commerce_backend.dto.request;

import lombok.Data;

@Data
public class AuthRequest {
    private String username;
    private String password;
}