package com.otabek.e_commerce_backend.controller;

import com.otabek.e_commerce_backend.dto.request.AuthRequest;
import com.otabek.e_commerce_backend.dto.response.UserResponseDTO;
import com.otabek.e_commerce_backend.security.JwtUtil;
import com.otabek.e_commerce_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest authRequest){
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                authRequest.getUsername(),authRequest.getPassword()
                )
        );

        UserResponseDTO userDto = userService.getUserByUsername(authRequest.getUsername());
        String token = jwtUtil.generateToken(authRequest.getUsername(), userDto.getRole());
        return ResponseEntity.ok(token);
    }
}
