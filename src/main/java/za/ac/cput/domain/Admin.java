/*
Admin.java
Justin Angelo Karoles (222008237)
14 July 2025
*/

package za.ac.cput.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.UUID;

@Entity
public class Admin {

    @Id
    protected UUID adminId;

    @Email
    @NotBlank
    protected String email;

    @NotBlank
    protected String password;

    protected String fullName;

    protected Admin() {
        // JPA default constructor
    }

    public Admin(UUID adminId, String fullName, String email, String password) {
        this.adminId = adminId;
        this.fullName = fullName;
        this.email = email;
        this.password = password;
    }

    public UUID getAdminId() {
        return adminId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "adminId=" + adminId +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }
}
