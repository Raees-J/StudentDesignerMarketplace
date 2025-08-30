/*
 * User.java
 * Author: Raees Johaadien (230558135)
 * Date: 10 May 2025
 */

package za.ac.cput.domain;

import jakarta.persistence.*;
import java.util.UUID;

@Entity
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    protected UUID userId;

    protected String email;
    protected String password;
    protected String role;

    protected User() {
        // Required by JPA
    }

    public User(String email, String password, String role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ✅ Builder-based constructor
    public User(Builder builder) {
        this.email = builder.email;
        this.password = builder.password;
        this.role = builder.role;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getRole() {
        return role;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

    // ✅ Builder class
    public static class Builder {
        private String email;
        private String password;
        private String role;

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder setRole(String role) {
            this.role = role;
            return this;
        }

        public Builder copy(User user) {
            this.email = user.email;
            this.password = user.password;
            this.role = user.role;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }
}