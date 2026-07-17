package com.otabek.nexus.security;

/**
 * The subset of verified claims we care about from a Google ID token.
 */
public record GoogleUserInfo(String email, String name) {
}
