package za.ac.cput.factory;

import za.ac.cput.domain.Order;
import za.ac.cput.util.Helper;

import java.util.UUID;

public class OrderFactory {
    public static Order buildOrder(String productID, String customerID, int quantity, double total){
        if (Helper.isNullorEmpty(productID) || Helper.isNullorEmpty(customerID) || quantity <= 0 || total < 0){
            return null;
        }

        String orderID = UUID.randomUUID().toString();

        return new Order.Builder()
                .setOrderID(orderID)
                .setProductID(productID)
                .setCustomerID(customerID)
                .setQuantity(quantity)
                .setTotal(total)
                .build();
    }
}