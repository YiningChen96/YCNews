package NewsWebsite.news.config;

import NewsWebsite.news.service.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.util.StringUtils;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;

import java.io.IOException;
import java.util.List;

@Configuration
public class SecurityConfig {

    @Autowired
    private JwtService jwtService;

    @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors().configurationSource(corsConfigurationSource())
        .and()
        .csrf().disable()
        .authorizeHttpRequests(auth -> auth
            // ✅ 允许访问静态资源（图片、CSS、JS）
            .requestMatchers("/static/**", "/uploads/**").permitAll()

            // ✅ 允许前端访问 API（开发阶段）
            .requestMatchers("/api/**").permitAll()

            // ✅ 允许任何用户访问 /admin/login
            .requestMatchers("/admin/login").permitAll()

            // ✅ 限制 /admin/** 只有 SUPER_ADMIN 能访问
            .requestMatchers("/admin/**").hasAuthority("SUPER_ADMIN")

            // ✅ 限制 /articles/**、/image-news/** 和 /images/** 只有 SUPER_ADMIN 和 ADMIN 可以访问
            .requestMatchers("/articles/add", "/articles/deleteArticle","/articles/deleteArticleImage","/articles/deleteBackgroundImage",
            "/image-news/set", "/image-news/delete",
            "/images/uploadArticleImage","/images/uploadBackgroundImage","/images/deleteBackgroundImage","/images/deleteImage")
            .hasAnyAuthority("SUPER_ADMIN", "ADMIN")

            // ✅ 其他请求允许访问（可根据需要更严格）
            .anyRequest().permitAll()
        )
        // ✅ 添加 JWT 认证过滤器
        .addFilterBefore(this::jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    // ✅ 认证管理器
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    // ✅ 配置 CORS
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200")); // ✅ 允许 Angular 前端访问
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*")); // ✅ 允许所有 Headers
        configuration.setExposedHeaders(List.of("Authorization")); // ✅ 让前端可以访问 Authorization 头
        configuration.setAllowCredentials(true); // ✅ 允许携带 Cookie

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    // ✅ JWT 认证过滤器
    private void jwtAuthenticationFilter(ServletRequest request, ServletResponse response, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        String token = getJwtFromRequest(httpRequest);

        SecurityContextHolder.clearContext();

        if (StringUtils.hasText(token) && jwtService.validateToken(token, jwtService.extractUsername(token))) {
            String username = jwtService.extractUsername(token);
            String role = jwtService.extractRole(token);
            
            // ✅ 设置 Spring Security 认证信息
            SecurityContextHolder.getContext().setAuthentication(
                new org.springframework.security.authentication.UsernamePasswordAuthenticationToken(
                    username, null, List.of(new SimpleGrantedAuthority(role))
                )
            );
        }
        filterChain.doFilter(request, response);
    }

    // ✅ 从请求头中获取 JWT
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        return (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) 
            ? bearerToken.substring(7) 
            : null;
    }
}
