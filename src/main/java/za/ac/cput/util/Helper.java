package za.ac.cput.util;

import org.apache.commons.validator.routines.EmailValidator;

public class Helper {
    public static boolean isNullorEmpty(String s) {
        if (s.isEmpty() || s == null)
            return true;
        return false;

    }

    public static boolean isValidEmail(String email) {
        EmailValidator validator = EmailValidator.getInstance();
        if (validator.isValid(email)) {

            return true;
        } else {
            return false;
        }
    }
}
