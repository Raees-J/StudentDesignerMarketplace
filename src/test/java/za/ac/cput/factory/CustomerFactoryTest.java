package za.ac.cput.factory;
import org.junit.jupiter.api.Test;
import za.ac.cput.domain.UType.Customer;
import static org.junit.jupiter.api.Assertions.*;

class CustomerFactoryTest {
    @Test
    void createCustomer_ValidPaymentMethod() {
        // Test case 1: Valid payment method "Card"
        Customer customer1 = CustomerFactory.createCustomer("john@example.com", "pass123", "Card", 150.75);
        assertNotNull(customer1);
        assertEquals("Card", customer1.getPaymentMethod());
        assertEquals(150.75, customer1.getAmount());
        // Test case 2: Valid payment method "Cash"
        Customer customer2 = CustomerFactory.createCustomer("jane@example.com", "pass456", "Cash", 50.00);
        assertNotNull(customer2);
        assertEquals("Cash", customer2.getPaymentMethod());
        assertEquals(50.00, customer2.getAmount());
        // Test case 3: Valid payment method "Online"
        Customer customer3 = CustomerFactory.createCustomer("alice@example.com", "pass789", "Online", 299.99);
        assertNotNull(customer3);
        assertEquals("Online", customer3.getPaymentMethod());
        assertEquals(299.99, customer3.getAmount());
    }

    @Test
    void createCustomer_InvalidPaymentMethod() {
        // Test case 4: Invalid payment method
        IllegalArgumentException exception = assertThrows(IllegalArgumentException.class, () -> {
            CustomerFactory.createCustomer("test@example.com", "pass000", "Bitcoin", 100.00);
        });
        assertEquals("Invalid payment method. Allowed: Card, Cash, Online.", exception.getMessage());
        // Test case 5: Null payment method
        IllegalArgumentException exception2 = assertThrows(IllegalArgumentException.class, () -> {
            CustomerFactory.createCustomer("test2@example.com", "pass111", null, 75.00);
        });
        assertEquals("Invalid payment method. Allowed: Card, Cash, Online.", exception2.getMessage());
        // Test case 6: Empty payment method
        IllegalArgumentException exception3 = assertThrows(IllegalArgumentException.class, () -> {
            CustomerFactory.createCustomer("test3@example.com", "pass222", "", 200.00);
        });
        assertEquals("Invalid payment method. Allowed: Card, Cash, Online.", exception3.getMessage());
    }
}