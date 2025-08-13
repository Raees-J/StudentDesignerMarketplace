package za.ac.cput.factory;

import za.ac.cput.domain.UType.Admin;
import java.util.UUID;

public class AdminFactory {

    public static Admin createAdmin(String userName, String email, String password, String firstName, String lastName) {
        if (isNullOrEmpty(userName) || isNullOrEmpty(email) || isNullOrEmpty(password) || isNullOrEmpty(firstName) || isNullOrEmpty(lastName)) {
            throw new IllegalArgumentException("All fields are required and must not be null or empty");
        }

        return new Admin.Builder()
                .setUserId(UUID.randomUUID())
                .setUserName(userName)
                .setEmail(email)
                .setPassword(password)
                .setRole("ADMIN") // assuming role is fixed
                .setAdminLevel("Standard") // or pass this as a parameter
                .build();
    }

    private static boolean isNullOrEmpty(String value) {
        return value == null || value.trim().isEmpty();
    }
}