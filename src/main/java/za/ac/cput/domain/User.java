/*
User.java
Raees Johaadien(230558135)
10 May 2025
 */

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
    public User(Builder builder) {
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.password = builder.password;
        this.email = builder.email;
        this.location = builder.location;
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

    public static class Builder {
        private UUID userId;
        private String userName;
        private String password;
        private String email;
        private String location;

        public Builder setUserId(UUID userId) {
            this.userId = userId;
            return this;
        }

        public Builder setUserName(String userName) {
            this.userName = userName;
            return this;
        }

        public Builder setPassword(String password) {
            this.password = password;
            return this;
        }

        public Builder setEmail(String email) {
            this.email = email;
            return this;
        }

        public Builder setLocation(String location) {
            this.location = location;
            return this;
        }

        public Builder copy(User user) {
            this.userId = user.userId;
            this.userName = user.userName;
            this.password = user.password;
            this.email = user.email;
            this.location = user.location;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }


}
