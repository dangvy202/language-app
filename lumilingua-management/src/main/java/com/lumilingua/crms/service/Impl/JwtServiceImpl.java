package com.lumilingua.crms.service.Impl;

import com.lumilingua.crms.service.JwtService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtServiceImpl implements JwtService {

    private static final String SECRET_KEY = "43MZw7N4sfnif+anE0Ls/iPiYjtoqqnLo5KFGa21SuExFcCW2t11N4Zj3Jx5isQH7wu+/D/tZlRFcPZqcZAW4lLpv54IykAOazvT/N3q7ZmJqrzOHQ6ICdhBJLXW4vB/a0tjWV2JIE6yNeSFmVKNoDQwa3CbCYxENAVI66FhswpioDnSNn6xdgJ+k4fD/8THJjEeqHd0zdGAazL2h03nOSsY0UbNWQMFiiw9MdkuZW5txP3HbLMbRZLujlBGeH7g5J7Gng78s/XipCbWA3pw6UZTwUIpC2i50ZbmcpZGE4RYmFMbTPhbVuuLteR9jwXP59gKeXpXrV3sIunOuATrSqgeK6Ps1x6gzrCeMT8GH30=";

    @Override
    public String extractUserName(String token) {
        return extractClaim(token,Claims::getSubject);
    }

    @Override
    public Boolean isTokenValid(String token , UserDetails userDetails) {
        final String username = extractUserName(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    private boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token,Claims::getExpiration);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        return this.generateTokenApp(new HashMap<>() , userDetails);
    }

    private String generateTokenApp(Map<String,Object> extraClaims , UserDetails userDetails){
        return Jwts
                .builder()
                .setClaims(extraClaims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 24))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    private <T> T extractClaim(String token, Function<Claims,T> claimsResolve) {
        final Claims claims = extractAllClaims(token);
        return claimsResolve.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts
                .parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Key getSigningKey() {
        byte[] keyByte = Decoders.BASE64.decode(SECRET_KEY);
        return Keys.hmacShaKeyFor(keyByte);
    }
}
