package com.otabek.nexus.controller;

import com.otabek.nexus.dto.request.AuthRequest;
import com.otabek.nexus.dto.request.GoogleAuthRequest;
import com.otabek.nexus.dto.request.RegisterRequest;
import com.otabek.nexus.dto.response.UserResponseDTO;
import com.otabek.nexus.security.GoogleTokenVerifier;
import com.otabek.nexus.security.GoogleUserInfo;
import com.otabek.nexus.security.JwtUtil;
import com.otabek.nexus.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/auth")
public class AuthController {
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final GoogleTokenVerifier googleTokenVerifier;

    /**
     * Login by email OR username. The submitted identifier is resolved to a
     * concrete account first, then its real username is used both to
     * authenticate and to sign the JWT.
     */
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody AuthRequest authRequest) {
        // Resolve + authenticate behind a single generic failure message so the
        // response can't be used to tell "no such account" apart from "wrong password".
        UserResponseDTO user;
        try {
            user = userService.getByUsernameOrEmail(authRequest.getUsername());
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(user.getUsername(), authRequest.getPassword())
            );
        } catch (EntityNotFoundException | AuthenticationException e) {
            throw new BadCredentialsException("Invalid email or password");
        }

        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(token);
    }

    /**
     * Self-service sign-up. On success the account is created and a JWT is
     * returned immediately so the client can drop the user straight onto the
     * storefront (no separate login step).
     */
    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        UserResponseDTO user = userService.register(request);
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.status(201).body(token);
    }

    /**
     * "Continue with Google". Verifies the Google ID token, provisions a local
     * account on first sign-in, and returns our own JWT.
     */
    @PostMapping("/google")
    public ResponseEntity<String> google(@RequestBody GoogleAuthRequest request) {
        GoogleUserInfo info = googleTokenVerifier.verify(request.getCredential());
        UserResponseDTO user = userService.findOrCreateGoogleUser(info.email(), info.name());
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole());
        return ResponseEntity.ok(token);
    }

    /**
     * Exposes the public Google client id so the static frontend doesn't have
     * to hardcode it. Returns an empty string when Google Sign-In is unconfigured,
     * which the frontend uses to hide the button.
     */
    @GetMapping("/google/config")
    public ResponseEntity<Map<String, Object>> googleConfig() {
        return ResponseEntity.ok(Map.of(
                "enabled", googleTokenVerifier.isConfigured(),
                "clientId", googleTokenVerifier.getClientId()
        ));
    }
}
