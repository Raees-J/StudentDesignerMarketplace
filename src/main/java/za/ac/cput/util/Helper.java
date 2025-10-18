package za.ac.cput.util;

import org.apache.commons.validator.routines.EmailValidator;
import java.net.URI;
import java.net.URISyntaxException;

public class Helper {
    public static boolean isNullOrEmpty(String s) {
        return s == null || s.isEmpty();
    }

    public static boolean isValidEmail(String email) {
        return EmailValidator.getInstance().isValid(email);
    }


    public static boolean isValidURL(String url) {
        if (isNullOrEmpty(url)) {
            return false;
        }

        try {
            URI uri = new URI(url);
            String scheme = uri.getScheme();
            if (scheme == null) {
                return false;
            }

            boolean httpScheme = scheme.equalsIgnoreCase("http") || scheme.equalsIgnoreCase("https");
            return httpScheme && uri.getHost() != null;
        } catch (URISyntaxException e) {
            return false;
        }    }

    public static boolean isValidPaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isEmpty()) {
            return false;
        }
        return paymentMethod != null && !paymentMethod.isEmpty() &&
                (paymentMethod.equalsIgnoreCase("Card") ||
                        paymentMethod.equalsIgnoreCase("Cash") ||
                        paymentMethod.equalsIgnoreCase("Online"));
    }
}
