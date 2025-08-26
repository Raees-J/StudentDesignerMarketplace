package za.ac.cput.factory;

import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Order;

import static org.junit.jupiter.api.Assertions.*;

class OrderFactoryTest {
    @Test
    void buildOrder(){
        Order order = OrderFactory.buildOrder("p1", "c1", 2, 300.0);
        assertNotNull(order);
        assertEquals("p1", order.getProductID());
    }
}