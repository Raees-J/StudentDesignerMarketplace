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

    protected String email;

    protected String password;

    protected User (){

    }
    public User(Builder builder) {
        this.userId = builder.userId;
        this.userName = builder.userName;
        this.email = builder.email;
        this.password = builder.password;
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



    @Override
    public String toString() {
        return "User{" +
                "userId=" + userId +
                ", userName='" + userName + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
    }

    public static class Builder {
        private UUID userId;
        private String userName;
        private String email;
        private String password;


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



        public Builder copy(User user) {
            this.userId = user.userId;
            this.userName = user.userName;
            this.email = user.email;
            this.password = user.password;
            return this;
        }

        public User build() {
            return new User(this);
        }
    }


}
