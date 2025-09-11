package za.ac.cput.factory;

import za.ac.cput.domain.Product;
import za.ac.cput.util.Helper;

import java.util.UUID;

public class ProductFactory {
    public static Product buildProduct(String name, String description, double price) {
        if (Helper.isNullOrEmpty(name) || Helper.isNullOrEmpty(description) || price <= 0) {
            return null;
        }

        String productID = UUID.randomUUID().toString();

        return new Product.Builder()
                .setProductID(productID)
                .setName(name)
                .setDescription(description)
                .setPrice(price)
                .build();
    }
}