package za.ac.cput.factory;

import za.ac.cput.domain.UType.Customer;
import za.ac.cput.util.Helper;

public class CustomerFactory {
    public static Customer createCustomer(String firstName, String lastName, String email, String password, String paymentMethod, double amount) {
        if (!Helper.isValidPaymentMethod(paymentMethod)) {
            throw new IllegalArgumentException("Invalid payment method. Allowed: Card, Cash, EFT, Online.");
        }
        return new Customer.Builder()
                .setFirstName(firstName)
                .setLastName(lastName)
                .setEmail(email)
                .setPassword(password)
                .setRole("customer") // Default role
                .setPaymentMethod(paymentMethod)
                .setAmount(amount)
                .build();
    }

    // Overloaded method for backward compatibility (without names)
    public static Customer createCustomer(String email, String password, String paymentMethod, double amount) {
        return createCustomer("", "", email, password, paymentMethod, amount);
    }
}