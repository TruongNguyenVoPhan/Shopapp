package com.project.shopapp.components;

import com.project.shopapp.exceptions.InvalidParamException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.io.Encoders;
import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.SecureRandom;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Component
@RequiredArgsConstructor
public class JwtTokenUtil {
    @Value("${jwt.expiration}")
    private int expiration; //save to environment variable
    @Value("${jwt.secretKey}")
    private String secretKey;
    public String generateToken(com.project.shopapp.models.User user) throws Exception{
        //properties => claims
        Map<String, Object> claims = new HashMap<>();
        //this.generateSecretKey();
        claims.put("phoneNumber", user.getPhoneNumber());
        try {
            String token = Jwts.builder()
                    .claims(claims) // how to extract from this
                    .subject(user.getPhoneNumber())
                    .expiration(new Date(System.currentTimeMillis() + expiration * 1000L))
                    .signWith(getSignKey())
                    .compact();
            return token;
        }   catch (Exception e){
            //you can "inject" Logger System.out.println("Cannot create jwt token, error: " +e.getMessage());
            throw new InvalidParamException("Cannot create jwt token, error: " +e.getMessage());
            //return null;
        }
    }
    private SecretKey getSignKey(){
        byte[] bytes = Decoders.BASE64.decode(secretKey);//Decoders.BASE64.decode("tA6OX5COgkJCWqGs5PXLmRPBgTaFFT7hphFk0ud8hXI=");
        return Keys.hmacShaKeyFor(bytes);//Keys.hmacShaKeyFor("tA6OX5COgkJCWqGs5PXLmRPBgTaFFT7hphFk0ud8hXI=");
    }
    private String generateSecretKey(){
        SecureRandom random = new SecureRandom();
        byte[] keyBytes = new byte[32];
        random.nextBytes(keyBytes);
        String secretKey = Encoders.BASE64.encode(keyBytes);
        return secretKey;
    }
    private Claims extractAllClaims(String token){
        return Jwts.parser()
                .verifyWith(getSignKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
    public  <T> T extractClaims(String token, Function<Claims, T> claimsTFunction) {
        final Claims claims = this.extractAllClaims(token);
        return claimsTFunction.apply(claims);
    }
    //check expiration
    public boolean isTokenExpiration(String token) {
        Date expirationDate = this.extractClaims(token, Claims::getExpiration);
        return expirationDate.before(new Date());
    }
    public String extractPhoneNumber(String token){
        return extractClaims(token, Claims::getSubject);
    }

    public boolean validateToken(String token, UserDetails userDetails){
        String phoneNumber = extractPhoneNumber(token);
        return (phoneNumber.equals(userDetails.getUsername()))
                && !isTokenExpiration(token);
    }
}
