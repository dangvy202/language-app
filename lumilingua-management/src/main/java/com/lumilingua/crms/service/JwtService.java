package com.lumilingua.crms.service;

import org.springframework.security.core.userdetails.UserDetails;

public interface JwtService {
    String extractUserName(String token);
    Boolean isTokenValid(String token , UserDetails userDetails);
    String generateToken(UserDetails userDetails);
}
