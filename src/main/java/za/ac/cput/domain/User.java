package za.ac.cput.domain;

import java.util.UUID;

public class User {
    protected UUID userId;

    protected String userName;

    protected String password;

    protected String email;

    protected String location;

    protected User (){

    }
    public User(UUID userId, String userName, String password, String email, String location) {
        this.userId = userId;
        this.userName = userName;
        this.password = password;
        this.email = email;
        this.location = location;
    }

    public UUID getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public String getPassword() {
        return password;
    }

    public String getEmail() {
        return email;
    }

    public String getLocation() {
        return location;
    }

    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", password='" + password + '\'' +
                ", email='" + email + '\'' +
                ", location='" + location + '\'' +
                '}';
    }
}
