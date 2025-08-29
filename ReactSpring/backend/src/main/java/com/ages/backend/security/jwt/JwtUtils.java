package com.ages.backend.security.jwt;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import jakarta.servlet.http.Cookie;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.naming.AuthenticationException;
import java.security.Key;
import java.sql.Date;
import java.time.Duration;
import java.time.Instant;
import java.util.UUID;

@Component
public class JwtUtils {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expirationDays}")
    private Long jwtExpirationDays;

    @Value("${app.jwt.cookieName}")
    private String jwtCookieName;

    private static final Logger logger = LoggerFactory.getLogger(JwtUtils.class);

    public ResponseCookie generateCookie(String jwt) {
        return ResponseCookie.from(jwtCookieName, jwt)
                .maxAge(Duration.ofDays(jwtExpirationDays))
                .httpOnly(true)
                .secure(false)
                .path("/")
                .build();
    }

    public String generateTokenFromId(UUID id) {

        Instant currentInstant = Instant.now();
        return Jwts.builder()
                .subject(id.toString())
                .issuedAt(Date.from(currentInstant))
                .expiration(Date.from(currentInstant.plusMillis(jwtExpirationDays * 24 * 60 * 60 * 1000)))
                .signWith(key())
                .compact();
    }

    public Key key() {
        return Keys.hmacShaKeyFor(Decoders.BASE64.decode(jwtSecret));
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().verifyWith((SecretKey) key())
                    .build().parseSignedClaims(authToken);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Invalid JWT Token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("JWT token is expired: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("JWT token is unsupported: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Error with JWT token: {}", e.getMessage());
        }
        return false;
    }

    public UUID getUserIdFromToken(String token) {
        try {
            String subject = Jwts.parser()
                    .verifyWith((SecretKey) key())
                    .build()
                    .parseSignedClaims(token)
                    .getPayload()
                    .getSubject();

            return UUID.fromString(subject);
        } catch (JwtException | IllegalArgumentException e) {
            throw new AuthenticationServiceException("Invalid JWT Subject", e);
        }
    }

    public ResponseCookie getClearJwtCookie() {
        return ResponseCookie.from(jwtCookieName, "")
                .httpOnly(true)
                .secure(false)
                .maxAge(0)
                .path("/")
                .build();
    }
}
