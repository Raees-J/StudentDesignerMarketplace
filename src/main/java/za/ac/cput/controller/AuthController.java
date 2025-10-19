package za.ac.cput.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import za.ac.cput.domain.Admin;
import za.ac.cput.domain.User;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.repository.UserRepository;
import za.ac.cput.service.AuthService;
import za.ac.cput.util.JwtUtil;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthService authService;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    public AuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil,
                          AuthService authService, UserRepository userRepository, AdminRepository adminRepository) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            // Authenticate using email (not username)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            // Check User table first
            Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", createUserResponse(user));
                return ResponseEntity.ok(response);
            }

            // Check Admin table
            Optional<Admin> adminOpt = adminRepository.findByEmail(request.getEmail());
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole(), admin.getId());

                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", createAdminResponse(admin));
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.status(404).body("User not found");
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(error);
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        try {
            Object registeredUser = authService.registerUser(
                    request.getEmail(),
                    request.getPassword(),
                    request.getRole()

            );

            Map<String, Object> response = new HashMap<>();

            if (registeredUser instanceof User user) {
                String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getUserId());
                response.put("token", token);
                response.put("user", createUserResponse(user));
            } else if (registeredUser instanceof Admin admin) {
                String token = jwtUtil.generateToken(admin.getEmail(), admin.getRole(), admin.getId());
                response.put("token", token);
                response.put("user", createAdminResponse(admin));
            }

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();

        // Check User table
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            return ResponseEntity.ok(createUserResponse(userOpt.get()));
        }

        // Check Admin table
        Optional<Admin> adminOpt = adminRepository.findByEmail(email);
        if (adminOpt.isPresent()) {
            return ResponseEntity.ok(createAdminResponse(adminOpt.get()));
        }

        return ResponseEntity.badRequest().body("User not found");
    }

    private Map<String, Object> createUserResponse(User user) {
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", user.getUserId().toString());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        return userMap;
    }

    private Map<String, Object> createAdminResponse(Admin admin) {
        Map<String, Object> adminMap = new HashMap<>();
        adminMap.put("id", admin.getId().toString());
        adminMap.put("email", admin.getEmail());
        adminMap.put("role", admin.getRole());
        adminMap.put("firstName", admin.getFirstName());
        adminMap.put("lastName", admin.getLastName());
        return adminMap;
    }

    // Updated LoginRequest class
    static class LoginRequest {
        private String email;
        private String password;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class RegisterRequest {
        private String email;
        private String password;
        private String role;

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}
