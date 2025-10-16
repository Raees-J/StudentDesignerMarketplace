/*
 * User.java
 * Author: Raees Johaadien (230558135)
 * Date: 10 May 2025
 */

package za.ac.cput.domain;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;

import java.util.Locale;
import java.util.UUID;

@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.JOINED)
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "user_id", columnDefinition = "BINARY(16)")
    protected UUID userId;

    @Column(name = "first_name")
    protected String firstName;

    @Column(name = "last_name")
    protected String lastName;

    @Email
    @Column(nullable = false, unique = true, length = 191)
    protected String email;

    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    protected String password;

    @Column(nullable = false, length = 32)
    protected String role;

    protected User() {
        // Required by JPA
    }

    public User(String firstName, String lastName, String email, String password, String role) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    // ✅ Builder-based constructor
    public User(Builder builder) {
        this.firstName = builder.firstName;
        this.lastName = builder.lastName;
        this.email = normalizeEmail(builder.email);
        this.password = builder.password;
        this.role = normalizeRole(builder.role);
    }

    public UUID getUserId() {
        return userId;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getPassword() {
        return password;
    }

    @PrePersist
    @PreUpdate
    protected void onPersistOrUpdate() {
        this.email = normalizeEmail(this.email);
        this.role = normalizeRole(this.role);
    }

    private String normalizeEmail(String value) {
        return value == null ? null : value.trim().toLowerCase(Locale.ROOT);
    }

    private String normalizeRole(String value) {
        return value == null ? null : value.trim().toUpperCase(Locale.ROOT);
    }

    @Override
        public String toString () {
            return "User{" +
                    "userId=" + userId +
                    ", firstName='" + firstName + '\'' +
                    ", lastName='" + lastName + '\'' +
                    ", email='" + email + '\'' +
                    ", role='" + role + '\'' +
                    '}';
        }

        // ✅ Builder class
        public static class Builder {
            private String firstName;
            private String lastName;
            private String email;
            private String password;
            private String role;

            public Builder setFirstName(String firstName) {
                this.firstName = firstName;
                return this;
            }

            public Builder setLastName(String lastName) {
                this.lastName = lastName;
                return this;
            }

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
                this.firstName = user.firstName;
                this.lastName = user.lastName;
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