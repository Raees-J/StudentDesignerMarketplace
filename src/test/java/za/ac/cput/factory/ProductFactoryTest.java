package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Product;

import static org.junit.jupiter.api.Assertions.*;

class ProductFactoryTest {
    @Test
    void buildProduct(){
        Product product = ProductFactory.buildProduct("Logo Design", "Professional logo", 150.0);
        assertNotNull(product);
        assertEquals("Logo Design", product.getName());
    }
}