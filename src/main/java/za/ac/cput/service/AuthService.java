package za.ac.cput.service;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import za.ac.cput.domain.Admin;
import za.ac.cput.domain.UType.Customer;
import za.ac.cput.domain.UType.Designer;
import za.ac.cput.repository.AdminRepository;
import za.ac.cput.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, AdminRepository adminRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public Object registerUser(String firstName, String lastName, String email, String password, String role) {
        // Check if email already exists in either table
        if (userRepository.findByEmail(email).isPresent() || adminRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String encryptedPassword = passwordEncoder.encode(password);

        // Create appropriate user type based on role
        switch (role.toUpperCase()) {
            case "CUSTOMER":
                Customer customer = new Customer.Builder()
                        .setFirstName(firstName)
                        .setLastName(lastName)
                        .setEmail(email)
                        .setPassword(encryptedPassword)
                        .setRole("CUSTOMER")
                        .setPaymentMethod("") // Default empty
                        .setAmount(0.0) // Default 0
                        .build();
                return userRepository.save(customer);

            case "DESIGNER":
                Designer designer = new Designer.Builder()
                        .setFirstName(firstName)
                        .setLastName(lastName)
                        .setEmail(email)
                        .setPassword(encryptedPassword)
                        .setRole("DESIGNER")
                        .setPortfolioURL("") // Default empty
                        .build();
                return userRepository.save(designer);

            case "ADMIN":
                Admin admin = new Admin.Builder()
                        .setFirstName(firstName)
                        .setLastName(lastName)
                        .setEmail(email)
                        .setPassword(encryptedPassword)
                        .setRole("ADMIN")
                        .build();
                return adminRepository.save(admin);

            default:
                throw new RuntimeException("Invalid role: " + role);
        }
    }
}
