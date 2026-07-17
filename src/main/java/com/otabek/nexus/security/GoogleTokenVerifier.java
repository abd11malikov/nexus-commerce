package com.otabek.nexus.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;

/**
 * Verifies Google Sign-In ID tokens on the server.
 *
 * The browser obtains a signed JWT ("credential") from Google Identity
 * Services and posts it to us. We must NOT trust its contents until the
 * signature, issuer, audience (our client id) and expiry have all been
 * validated against Google's public keys — which is exactly what
 * {@link GoogleIdTokenVerifier} does.
 */
@Component
public class GoogleTokenVerifier {

    /** OAuth 2.0 Web client id from Google Cloud Console. Empty until configured. */
    @Value("${google.oauth.client-id:}")
    private String clientId;

    public boolean isConfigured() {
        return clientId != null && !clientId.isBlank();
    }

    /** The public OAuth client id, safe to expose to the browser. */
    public String getClientId() {
        return clientId == null ? "" : clientId;
    }

    public GoogleUserInfo verify(String idTokenString) {
        if (!isConfigured()) {
            throw new IllegalStateException("Google Sign-In is not configured on the server");
        }
        if (idTokenString == null || idTokenString.isBlank()) {
            throw new IllegalArgumentException("Missing Google credential");
        }

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                new NetHttpTransport(), GsonFactory.getDefaultInstance())
                .setAudience(Collections.singletonList(clientId))
                .build();

        try {
            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken == null) {
                throw new IllegalArgumentException("Invalid Google credential");
            }
            GoogleIdToken.Payload payload = idToken.getPayload();

            Boolean emailVerified = payload.getEmailVerified();
            if (emailVerified == null || !emailVerified) {
                throw new IllegalArgumentException("Google account email is not verified");
            }

            String email = payload.getEmail();
            String name = (String) payload.get("name");
            return new GoogleUserInfo(email, name);
        } catch (GeneralSecurityException | IOException e) {
            throw new IllegalArgumentException("Could not verify Google credential: " + e.getMessage());
        }
    }
}
