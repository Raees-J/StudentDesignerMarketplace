package za.ac.cput.controller;

import za.ac.cput.domain.Admin;
import za.ac.cput.domain.User;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.repository.UserRepository;
import za.ac.cput.service.AuthService;
import za.ac.cput.util.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/**")
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
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            String token = jwtUtil.generateToken(request.getUsername());

            // Check User table first
            Optional<User> userOpt = userRepository.findByEmail(request.getUsername());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", createUserResponse(user));
                return ResponseEntity.ok(response);
            }

            // Check Admin table
            Optional<Admin> adminOpt = adminRepository.findByEmail(request.getUsername());
            if (adminOpt.isPresent()) {
                Admin admin = adminOpt.get();
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", createAdminResponse(admin));
                return ResponseEntity.ok(response);
            }

            return ResponseEntity.badRequest().body("User not found");
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.badRequest().body(error);
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

            String token = jwtUtil.generateToken(request.getEmail());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);

            if (registeredUser instanceof User) {
                response.put("user", createUserResponse((User) registeredUser));
            } else if (registeredUser instanceof Admin) {
                response.put("user", createAdminResponse((Admin) registeredUser));
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
        userMap.put("username", user.getEmail());
        userMap.put("email", user.getEmail());
        userMap.put("role", user.getRole());
        return userMap;
    }

    private Map<String, Object> createAdminResponse(Admin admin) {
        Map<String, Object> adminMap = new HashMap<>();
        adminMap.put("id", admin.getId().toString());
        adminMap.put("username", admin.getEmail());
        adminMap.put("email", admin.getEmail());
        adminMap.put("role", admin.getRole());
        adminMap.put("firstName", admin.getFirstName());
        adminMap.put("lastName", admin.getLastName());
        return adminMap;
    }

    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }

    static class RegisterRequest {
        private String username;
        private String email;
        private String password;
        private String role;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
        public String getRole() { return role; }
        public void setRole(String role) { this.role = role; }
    }
}