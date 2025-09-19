package za.ac.cput.factory;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import org.junit.jupiter.api.Test;

import za.ac.cput.domain.Product;

class ProductFactoryTest {
    @Test
    void buildProduct(){
        Product product = ProductFactory.buildProduct("Logo Design", "Professional logo", 150.0, "img", "design");
        assertNotNull(product);
        assertEquals("Logo Design", product.getName());
        assertEquals("img", product.getImageUrl());
        assertEquals("design", product.getCategory());
    }
}