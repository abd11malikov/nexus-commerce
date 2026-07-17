package com.otabek.nexus.dto.request;

import lombok.Data;

/**
 * Payload for "Continue with Google". {@code credential} is the ID token
 * (a signed JWT) that Google Identity Services returns to the browser.
 * The server verifies it before trusting any of its claims.
 */
@Data
public class GoogleAuthRequest {
    private String credential;
}
