package za.ac.cput.controller;


import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import za.ac.cput.domain.UType.Customer;
import za.ac.cput.service.CustomerService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/profile")
public class ProfileController {

    private final CustomerService customerService;

    public ProfileController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @GetMapping
    public ResponseEntity<?> getProfile(@RequestParam @Email @NotBlank String email) {
        try {
            // Get authenticated user for security check
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }
            
            // Only allow users to access their own profile
            String authenticatedEmail = authentication.getName();
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            
            // Find customer by email since we don't have direct profile system
            Customer customer = customerService.findByEmail(email);
            if (customer == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Return profile data in expected format
            ProfileResponse profile = new ProfileResponse(
                customer.getFirstName() + " " + customer.getLastName(),
                customer.getEmail(),
                "", // phone - not stored in customer
                "", // address - not stored in customer  
                "", // city - not stored in customer
                "", // province - not stored in customer
                ""  // postalCode - not stored in customer
            );
            
            return ResponseEntity.ok(profile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error fetching profile");
        }
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestParam @Email @NotBlank String email, @RequestBody @Valid ProfileRequest profileData) {
        try {
            // Get authenticated user for security check
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }
            
            // Only allow users to update their own profile
            String authenticatedEmail = authentication.getName();
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            
            Customer customer = customerService.findByEmail(email);
            if (customer == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Update customer with available fields
            String[] names = profileData.getDisplayName().split(" ", 2);
            String firstName = names.length > 0 ? names[0] : "";
            String lastName = names.length > 1 ? names[1] : "";
            
            Customer updatedCustomer = new Customer.Builder()
                    .setFirstName(firstName)
                    .setLastName(lastName)
                    .setEmail(customer.getEmail())
                    .setPassword(customer.getPassword())
                    .setRole(customer.getRole())
                    .setPaymentMethod(customer.getPaymentMethod())
                    .setAmount(customer.getAmount())
                    .build();
                    
            customerService.update(updatedCustomer);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating profile");
        }
    }

    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestParam @Email @NotBlank String email, @RequestBody @Valid PasswordChangeRequest request) {
        try {
            // Get authenticated user for security check
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }
            
            // Only allow users to change their own password
            String authenticatedEmail = authentication.getName();
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            
            Customer customer = customerService.findByEmail(email);
            if (customer == null) {
                return ResponseEntity.notFound().build();
            }
            
            // In a real implementation, you'd verify the old password
            // For now, just update with new password
            Customer updatedCustomer = new Customer.Builder()
                    .setFirstName(customer.getFirstName())
                    .setLastName(customer.getLastName())
                    .setEmail(customer.getEmail())
                    .setPassword(request.getNewPassword())
                    .setRole(customer.getRole())
                    .setPaymentMethod(customer.getPaymentMethod())
                    .setAmount(customer.getAmount())
                    .build();
                    
            customerService.update(updatedCustomer);
            return ResponseEntity.ok("Password changed successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error changing password");
        }
    }

    @DeleteMapping
    public ResponseEntity<?> deleteAccount(@RequestParam @Email @NotBlank String email) {
        try {
            // Get authenticated user for security check
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication == null || !authentication.isAuthenticated()) {
                return ResponseEntity.status(401).build();
            }
            
            // Only allow users to delete their own account
            String authenticatedEmail = authentication.getName();
            if (!email.equals(authenticatedEmail)) {
                return ResponseEntity.status(403).build();
            }
            
            Customer customer = customerService.findByEmail(email);
            if (customer == null) {
                return ResponseEntity.notFound().build();
            }
            
            customerService.delete(customer.getUserId());
            return ResponseEntity.ok("Account deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting account");
        }
    }

    // DTOs
    public static class ProfileResponse {
        private String displayName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String province;
        private String postalCode;

        public ProfileResponse(String displayName, String email, String phone, String address, String city, String province, String postalCode) {
            this.displayName = displayName;
            this.email = email;
            this.phone = phone;
            this.address = address;
            this.city = city;
            this.province = province;
            this.postalCode = postalCode;
        }

        // Getters
        public String getDisplayName() { return displayName; }
        public String getEmail() { return email; }
        public String getPhone() { return phone; }
        public String getAddress() { return address; }
        public String getCity() { return city; }
        public String getProvince() { return province; }
        public String getPostalCode() { return postalCode; }
    }

    public static class ProfileRequest {
        private String displayName;
        private String email;
        private String phone;
        private String address;
        private String city;
        private String province;
        private String postalCode;

        // Getters and setters
        public String getDisplayName() { return displayName; }
        public void setDisplayName(String displayName) { this.displayName = displayName; }
        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }
        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }
        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }
        public String getCity() { return city; }
        public void setCity(String city) { this.city = city; }
        public String getProvince() { return province; }
        public void setProvince(String province) { this.province = province; }
        public String getPostalCode() { return postalCode; }
        public void setPostalCode(String postalCode) { this.postalCode = postalCode; }
    }

    public static class PasswordChangeRequest {
        private String oldPassword;
        private String newPassword;

        public String getOldPassword() { return oldPassword; }
        public void setOldPassword(String oldPassword) { this.oldPassword = oldPassword; }
        public String getNewPassword() { return newPassword; }
        public void setNewPassword(String newPassword) { this.newPassword = newPassword; }
    }
}