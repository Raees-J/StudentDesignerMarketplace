package za.ac.cput.factory;

import za.ac.cput.domain.User;
import za.ac.cput.util.Helper;

import java.util.UUID;

public class UserFactory {
    public static User createUser(UUID userId, String userName, String password, String email) {
        if (Helper.isNullorEmpty(userName) || Helper.isNullorEmpty(password))
            return null;
        if (!Helper.isValidEmail(email))
            return null;

        return new User.Builder()
                .setUserId(userId)
                .setUserName(userName)
                .setEmail(email)
                .setPassword(password)
                .build();
    }
}
