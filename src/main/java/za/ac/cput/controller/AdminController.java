/**
 * Author: Justin Angelo Karoles (222008237)
 * Date: October 2025
 */

package za.ac.cput.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import za.ac.cput.domain.Admin;
import za.ac.cput.factory.AdminFactory;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.service.AdminService;
import za.ac.cput.util.JwtUtil;

@RestController
@RequestMapping("/admins")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AdminController(AdminService adminService,
                           AdminRepository adminRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.adminService = adminService;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;

    @Autowired
    public AdminController(AdminService adminService, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.adminService = adminService;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody @Valid Admin adminInput) {
        try {
            // Validate and create admin entity using factory
            Admin newAdmin = AdminFactory.buildAdmin(
                    adminInput.getFirstName(),
                    adminInput.getLastName(),
                    adminInput.getEmail(),
                    passwordEncoder.encode(adminInput.getPassword()) // store encoded password
            );

            if (newAdmin == null) {
                return ResponseEntity.badRequest().body("Invalid input fields");
            }

            // Save to database
            Admin saved = adminService.create(newAdmin);

            // Generate JWT token for new admin
            String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole(), saved.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("admin", createAdminResponse(saved));

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Registration failed: " + e.getMessage());
        }
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody @Valid Admin loginInput) {
        try {
            System.out.println("Login attempt: " + loginInput.getEmail());

            Optional<Admin> adminOpt = adminRepository.findByEmail(loginInput.getEmail());

            if (adminOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not found");
            }

            Admin matched = adminOpt.get();

            if (!passwordEncoder.matches(loginInput.getPassword(), matched.getPassword())) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }

            String token = jwtUtil.generateToken(matched.getEmail(), matched.getRole(), matched.getId());

            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("admin", createAdminResponse(matched));
            Admin foundAdmin = adminRepository.findByEmail(loginInput.getEmail().trim().toLowerCase());

            if (foundAdmin == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not found");
            }

            if (!passwordEncoder.matches(loginInput.getPassword(), foundAdmin.getPassword())) {

                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }

            AdminLoginDTO dto = new AdminLoginDTO(
                    foundAdmin.getId(),
                    foundAdmin.getFirstName(),
                    foundAdmin.getLastName(),
                    foundAdmin.getEmail(),
                    foundAdmin.getRole()
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Login error: " + e.getMessage());
        }
    }


    @GetMapping("/all")
    public ResponseEntity<List<Admin>> getAll() {
        List<Admin> admins = adminService.getAll();
        return ResponseEntity.ok(admins);
    }


    @GetMapping("/read/{id}")
    public ResponseEntity<?> read(@PathVariable Long id) {
        Admin admin = adminService.read(id);
        return admin != null
                ? ResponseEntity.ok(createAdminResponse(admin))
                : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
    }


    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody Admin admin) {
        try {
            Admin existing = adminService.read(admin.getId());
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
            }

            // Rebuild admin safely using Builder
            Admin updatedAdmin = new Admin.Builder()
                    .copy(existing)
                    .setFirstName(admin.getFirstName())
                    .setLastName(admin.getLastName())
                    .setEmail(admin.getEmail())
                    .setRole(admin.getRole() != null ? admin.getRole() : existing.getRole())
                    .setPassword(
                            (admin.getPassword() != null && !admin.getPassword().isBlank())
                                    ? passwordEncoder.encode(admin.getPassword())
                                    : existing.getPassword()
                    )
                    .build();

            Admin saved = adminService.update(updatedAdmin);
            return ResponseEntity.ok(createAdminResponse(saved));

        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Update failed: " + e.getMessage());
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        adminService.delete(id);
        return ResponseEntity.ok().build();
    }


    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("Admin backend is running!");
    }

    private Map<String, Object> createAdminResponse(Admin admin) {
        Map<String, Object> adminMap = new HashMap<>();
        adminMap.put("id", admin.getId());
        adminMap.put("firstName", admin.getFirstName());
        adminMap.put("lastName", admin.getLastName());
        adminMap.put("email", admin.getEmail());
        adminMap.put("role", admin.getRole());
        return adminMap;
    }
}
