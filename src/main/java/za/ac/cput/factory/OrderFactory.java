package za.ac.cput.factory;

import java.util.UUID;

import za.ac.cput.domain.Order;
import za.ac.cput.util.Helper;

public class OrderFactory {
    public static Order buildOrder(String productID, String customerID, int quantity, double total, String paymentMethod) {
        if (Helper.isNullOrEmpty(productID) || Helper.isNullOrEmpty(customerID) || quantity <= 0 || total < 0) {
            return null;
        }

        if (!Helper.isValidPaymentMethod(paymentMethod)) {
            return null;
        }

        String orderID = UUID.randomUUID().toString();
        String paymentStatus = paymentMethod.equalsIgnoreCase("Cash") ? "PENDING_PICKUP" : "PENDING";

        return new Order.Builder()
                .setOrderID(orderID)
                .setProductID(productID)
                .setCustomerID(customerID)
                .setQuantity(quantity)
                .setTotal(total)
                .setPaymentMethod(paymentMethod)
                .setPaymentStatus(paymentStatus)
                .build();
    }

    // Overloaded method for backward compatibility
    public static Order buildOrder(String productID, String customerID, int quantity, double total) {
        return buildOrder(productID, customerID, quantity, total, "Card");
    }
}