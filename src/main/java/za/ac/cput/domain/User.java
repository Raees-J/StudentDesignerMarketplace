/*
User.java
Raees Johaadien(230558135)
10 May 2025
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

    protected String userName;

    protected String email;

    protected String password;

    protected String role;

    protected User (){

    }

    public User(String userName, String email, String password, String role) {
        this.userName = userName;
        this.email = email;
        this.password = password;
        this.role = role;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
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
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", role='" + role + '\'' +
                '}';
    }

}
