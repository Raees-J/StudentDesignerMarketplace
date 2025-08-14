

package za.ac.cput.domain.UType;

import jakarta.persistence.Entity;
import jakarta.persistence.PrimaryKeyJoinColumn;
import za.ac.cput.domain.User;

import java.util.UUID;

@Entity
@PrimaryKeyJoinColumn(name = "userId")
public class Admin extends User {

    private String adminLevel;

    protected Admin() {
        super();
    }

    private Admin(Builder builder) {
        super(builder.userId, builder.userName, builder.email, builder.password, builder.role);
        this.adminLevel = builder.adminLevel;
    }

    public String getAdminLevel() {
        return adminLevel;
    }

    public void setAdminLevel(String adminLevel) {
        this.adminLevel = adminLevel;
    }

    @Override
    public String toString() {
        return "Admin{" +
                "userId=" + getUserId() +
                ", userName='" + getUserName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", password='" + getPassword() + '\'' +
                ", role='" + getRole() + '\'' +
                ", adminLevel='" + adminLevel + '\'' +
                '}';
    }


    public static class Builder {
        private UUID userId;
        private String userName;
        private String email;
        private String password;
        private String role;
        private String adminLevel;

        public Builder setUserId(UUID userId) {
            this.userId = userId;
            return this;
        }

        public Builder setUserName(String userName) {
            this.userName = userName;
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

        public Builder setAdminLevel(String adminLevel) {
            this.adminLevel = adminLevel;
            return this;
        }

        public Admin build() {
            return new Admin(this);
        }


        public Builder copy(Admin admin) {
            this.userId = admin.getUserId();
            this.userName = admin.getUserName();
            this.email = admin.getEmail();
            this.password = admin.getPassword();
            this.role = admin.getRole();
            this.adminLevel = admin.getAdminLevel();
            return this;
        }
    }
}