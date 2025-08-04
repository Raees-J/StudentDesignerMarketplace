package za.ac.cput.util;

import org.apache.commons.validator.routines.EmailValidator;
import org.apache.commons.validator.routines.UrlValidator;

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


    public static boolean isValidURL(String url) throws MalformedURLException {
        UrlValidator validator = new UrlValidator();
        if(validator.isValid(url)){
            return true;
        }else {
            return false;
        }
    }

    public static boolean isValidPaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isEmpty()) {
            return false;
        }
        return paymentMethod.equalsIgnoreCase("Card") ||
                paymentMethod.equalsIgnoreCase("Cash") ||
                paymentMethod.equalsIgnoreCase("Online");
    }
}
