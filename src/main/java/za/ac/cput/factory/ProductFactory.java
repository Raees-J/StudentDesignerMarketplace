package za.ac.cput.factory;

import java.util.List;
import java.util.UUID;

import za.ac.cput.domain.Product;
import za.ac.cput.util.Helper;

public class ProductFactory {
    public static Product buildProduct(String name, String description, double price, String imageUrl, String category) {
        if (Helper.isNullOrEmpty(name) || Helper.isNullOrEmpty(description) || price <= 0 || Helper.isNullOrEmpty(imageUrl) || Helper.isNullOrEmpty(category)) {
            return null;
        }

        String productID = UUID.randomUUID().toString();

        return new Product.Builder()
                .setProductID(productID)
                .setName(name)
                .setDescription(description)
                .setPrice(price)
                .setImageUrl(imageUrl)
                .setCategory(category)
                .setInStock(true) // Default to in stock
                .build();
    }

    public static Product buildProduct(String name, String description, double price, String imageUrl, String category, 
                                     boolean inStock, List<String> sizes, List<String> colors, List<String> features) {
        if (Helper.isNullOrEmpty(name) || Helper.isNullOrEmpty(description) || price <= 0 || Helper.isNullOrEmpty(imageUrl) || Helper.isNullOrEmpty(category)) {
            return null;
        }

        String productID = UUID.randomUUID().toString();

        // Convert lists to comma-separated strings
        String sizesStr = (sizes != null && !sizes.isEmpty()) ? String.join(",", sizes) : "";
        String colorsStr = (colors != null && !colors.isEmpty()) ? String.join(",", colors) : "";
        String featuresStr = (features != null && !features.isEmpty()) ? String.join(",", features) : "";

        return new Product.Builder()
                .setProductID(productID)
                .setName(name)
                .setDescription(description)
                .setPrice(price)
                .setImageUrl(imageUrl)
                .setCategory(category)
                .setInStock(inStock)
                .setSizes(sizesStr)
                .setColors(colorsStr)
                .setFeatures(featuresStr)
                .build();
    }
}