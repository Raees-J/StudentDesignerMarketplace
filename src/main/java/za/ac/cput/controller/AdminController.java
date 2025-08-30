/**
 * Author: Justin Angelo Karoles (222008237)
 * Date: August 2025
 */

package za.ac.cput.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Admin;
import za.ac.cput.factory.AdminFactory;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.service.AdminService;

import java.util.List;

@RestController
@RequestMapping("/admins")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    private final AdminService adminService;
    private final AdminRepository adminRepository;

    @Autowired
    public AdminController(AdminService adminService, AdminRepository adminRepository) {
        this.adminService = adminService;
        this.adminRepository = adminRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Admin adminInput) {
        try {
            Admin newAdmin = AdminFactory.buildAdmin(
                    adminInput.getFirstName(),
                    adminInput.getLastName(),
                    adminInput.getEmail(),
                    adminInput.getPassword()
            );

            if (newAdmin == null) {
                return ResponseEntity.badRequest().body("Invalid input fields");
            }

            Admin saved = adminService.create(newAdmin);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DTO for secure login response
    public record AdminLoginDTO(Long id, String firstName, String lastName, String email, String role) {}

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Admin loginInput) {
        try {
            System.out.println("Login attempt: " + loginInput.getEmail());

            List<Admin> admins = adminRepository.findAllByEmail(loginInput.getEmail());

            if (admins.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email not found");
            }

            Admin matched = admins.stream()
                    .filter(a -> a.getPassword().equals(loginInput.getPassword()))
                    .findFirst()
                    .orElse(null);

            if (matched == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid password");
            }

            AdminLoginDTO dto = new AdminLoginDTO(
                    matched.getId(),
                    matched.getFirstName(),
                    matched.getLastName(),
                    matched.getEmail(),
                    matched.getRole()
            );

            return ResponseEntity.ok(dto);

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
    public ResponseEntity<Admin> read(@PathVariable Long id) {
        Admin admin = adminService.read(id);
        return admin != null
                ? ResponseEntity.ok(admin)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
    }

    @PostMapping("/update")
    public ResponseEntity<Admin> update(@RequestBody Admin admin) {
        Admin updated = adminService.update(admin);
        return updated != null
                ? ResponseEntity.ok(updated)
                : ResponseEntity.status(HttpStatus.NOT_FOUND).build();
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
}