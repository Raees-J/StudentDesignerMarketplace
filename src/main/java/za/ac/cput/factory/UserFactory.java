package za.ac.cput.factory;

import za.ac.cput.domain.User;
import za.ac.cput.util.Helper;

public class UserFactory {
    public static User createUser(String userName, String password, String email, String location) {
        if (Helper.isNullorEmpty(userName) || Helper.isNullorEmpty(password) || Helper.isNullorEmpty(location))
            return null;
        if (!Helper.isValidEmail(email))
            return null;

        return new User.Builder()
                .setUserName(userName)
                .setPassword(password)
                .setEmail(email)
                .setLocation(location)
                .build();
    }
}
