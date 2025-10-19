package za.ac.cput.Configuration;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import za.ac.cput.util.JwtAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsService userDetailsService;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsService userDetailsService) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsService = userDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/products/all", "/products/read/**", "/products/testProduct").permitAll()
                        .requestMatchers("/reviews/all", "/reviews/read/**", "/reviews/product/**").permitAll()
                        .requestMatchers("/*/ping").permitAll()

                        // Authentication endpoints
                        .requestMatchers("/auth/**").permitAll()

                        // Admin login
                        .requestMatchers("/admins/login").permitAll()

                        // Admin registration and admin-only endpoints
                        .requestMatchers("/admins/register").hasRole("ADMIN")
                        .requestMatchers("/admins/**").hasRole("ADMIN")
                        .requestMatchers("/products/create", "/products/update", "/products/delete/**").hasRole("ADMIN")
                        .requestMatchers("/orders/all", "/orders/updatePaymentStatus/**").hasRole("ADMIN")
                        .requestMatchers("/customer/getAll", "/customer/findByPaymentMethod").hasRole("ADMIN")

                        // Customer registration/login
                        .requestMatchers("/customer/create", "/customer/login").permitAll()

                        // Customer endpoints (and admin access)
                        .requestMatchers("/customer/read/**", "/customer/update", "/customer/delete/**").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/orders/create", "/orders/read/**", "/orders/update").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/profile/**").hasAnyRole("CUSTOMER", "ADMIN")
                        .requestMatchers("/reviews/create", "/reviews/update", "/reviews/delete/**").hasAnyRole("CUSTOMER", "ADMIN")

                        // Designer endpoints
                        .requestMatchers("/designer/**").hasAnyRole("DESIGNER", "ADMIN")

                        // Any other request requires authentication
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:5173", "http://localhost:3001"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Authorization"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
