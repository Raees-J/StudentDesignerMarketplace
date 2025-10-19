package za.ac.cput.factory;
import org.junit.jupiter.api.Test;
import za.ac.cput.domain.UType.Designer;
import java.net.MalformedURLException;
import static org.junit.jupiter.api.Assertions.*;
class DesignerFactoryTest {
    @Test
    void createDesigner_ValidPortfolioURL() throws MalformedURLException {
        // Test case 1: Valid HTTP URL
        Designer designer1 = DesignerFactory.createDesigner("http://www.example.com/portfolio");
        assertNotNull(designer1);
        assertEquals("http://www.example.com/portfolio", designer1.getPortfolioURL());
        // Test case 2: Valid HTTPS URL
        Designer designer2 = DesignerFactory.createDesigner("https://my-design.net/gallery");
        assertNotNull(designer2);
        assertEquals("https://my-design.net/gallery", designer2.getPortfolioURL());
        // Test case 3: Valid URL with path and query parameters
        Designer designer3 = DesignerFactory.createDesigner("https://www.behance.net/johndoe?page=1");
        assertNotNull(designer3);
        assertEquals("https://www.behance.net/johndoe?page=1", designer3.getPortfolioURL());
    }
    @Test
    void createDesigner_InvalidPortfolioURL() throws MalformedURLException {
        // Test case 4: Invalid URL format (missing protocol)
        Designer designer4 = DesignerFactory.createDesigner("www.invalid-url.com");
        assertNull(designer4);
        // Test case 5: Invalid URL format (just text)
        Designer designer5 = DesignerFactory.createDesigner("not-a-url");
        assertNull(designer5);
        // Test case 6: Null URL
        Designer designer6 = DesignerFactory.createDesigner(null);
        assertNull(designer6);
        // Test case 7: Empty URL
        Designer designer7 = DesignerFactory.createDesigner("");
        assertNull(designer7);
    }
}