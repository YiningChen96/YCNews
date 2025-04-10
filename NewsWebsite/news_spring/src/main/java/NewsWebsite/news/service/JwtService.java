package NewsWebsite.news.service;

import java.util.Date;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;

@Service
public class JwtService {

    @Value("${jwt.secret-key}")
    private String secretKey;
    private static final long EXPIRATION_TIME = 3600000;  // JWT过期时间（这里是1天）

    // 生成 JWT Token
    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)  // 存储用户名
                .claim("role", role)  // 存储角色
                .setIssuedAt(new Date())  // 设置JWT的签发时间
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // 设置过期时间
                .signWith(SignatureAlgorithm.HS256, secretKey)  // 使用密钥进行签名
                .compact();
    }

    // 解析 JWT Token
    public Claims extractClaims(String token) {
        return Jwts.parser()
                .setSigningKey(secretKey)
                .parseClaimsJws(token)
                .getBody();
    }

    // 获取用户名
    public String extractUsername(String token) {
        return extractClaims(token).getSubject();
    }

    // 获取角色
    public String extractRole(String token) {
        return (String) extractClaims(token).get("role");
    }

    // 验证 JWT Token是否有效
    public boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }

    // 验证 Token 是否有效
    public boolean validateToken(String token, String username) {
        return (username.equals(extractUsername(token)) && !isTokenExpired(token));
    }

        // 刷新 Token（根据需要扩展）
        public String refreshToken(String token) {
            String username = extractUsername(token);
            String role = extractRole(token);
            return generateToken(username, role);  // 根据旧的 Token 创建新的 Token
        }
    
}

