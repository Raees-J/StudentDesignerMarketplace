package za.ac.cput.factory;

import za.ac.cput.domain.UType.Customer;
import za.ac.cput.util.Helper;

public class CustomerFactory {
    public static Customer createCustomer(String email, String password, String paymentMethod, double amount) {
        if (!Helper.isValidPaymentMethod(paymentMethod)) {
            throw new IllegalArgumentException("Invalid payment method. Allowed: Card, Cash, Online.");
        }
        return new Customer.Builder()
                .setEmail(email)
                .setPassword(password)
                .setRole("customer") // Default role
                .setPaymentMethod(paymentMethod)
                .setAmount(amount)
                .build();
    }
}