package za.ac.cput.util;

import org.apache.commons.validator.routines.EmailValidator;

import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;

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

    boolean isValidURL(String url) throws MalformedURLException, URISyntaxException {
        try {
            new URL(url).toURI();
            return true;
        } catch (MalformedURLException e) {
            return false;
        } catch (URISyntaxException e) {
            return false;
        }
    }


}
