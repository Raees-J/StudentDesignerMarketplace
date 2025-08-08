package za.ac.cput.factory;

import za.ac.cput.domain.Admin;

import java.util.UUID;

public class AdminFactory {

    public static Admin createAdmin(String name, String surname, String email, String password) {
        // Validate input
        if (name == null || name.isEmpty()) {
            throw new IllegalArgumentException("Name is required.");
        }
        if (surname == null || surname.isEmpty()) {
            throw new IllegalArgumentException("Surname is required.");
        }
        if (email == null || email.isEmpty()) {
            throw new IllegalArgumentException("Email is required.");
        }
        if (password == null || password.isEmpty()) {
            throw new IllegalArgumentException("Password is required.");
        }

        // Generate a unique ID for the admin
        UUID adminId = UUID.randomUUID();

        // Create and return the Admin object
        return new Admin(adminId, name, surname, email, password);
    }
}