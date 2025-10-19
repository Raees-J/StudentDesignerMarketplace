package za.ac.cput.util;

import org.apache.commons.validator.routines.EmailValidator;
import org.apache.commons.validator.routines.UrlValidator;


public class Helper {
    public static boolean isNullOrEmpty(String s) {
        return s == null || s.isEmpty();
    }

    public static boolean isValidEmail(String email) {
        return EmailValidator.getInstance().isValid(email);
    }


    public static boolean isValidURL(String url) {
        return new UrlValidator().isValid(url);
    }

    public static boolean isValidPaymentMethod(String paymentMethod) {
        if (paymentMethod == null || paymentMethod.isEmpty()) {
            return false;
        }
        return paymentMethod != null && !paymentMethod.isEmpty() &&
                (paymentMethod.equalsIgnoreCase("Card") ||
                        paymentMethod.equalsIgnoreCase("Cash") ||
                        paymentMethod.equalsIgnoreCase("EFT") ||
                        paymentMethod.equalsIgnoreCase("Online"));
    }

    public static boolean isValidPaymentStatus(String paymentStatus) {
        if (paymentStatus == null || paymentStatus.isEmpty()) {
            return false;
        }
        return paymentStatus.equalsIgnoreCase("PENDING") ||
               paymentStatus.equalsIgnoreCase("COMPLETED") ||
               paymentStatus.equalsIgnoreCase("FAILED") ||
               paymentStatus.equalsIgnoreCase("PENDING_PICKUP") ||
               paymentStatus.equalsIgnoreCase("CANCELLED");
    }
}
