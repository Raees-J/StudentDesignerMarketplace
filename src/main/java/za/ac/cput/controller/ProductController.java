package za.ac.cput.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import za.ac.cput.domain.Product;
import za.ac.cput.factory.ProductFactory;
import za.ac.cput.repository.ProductRepository;
import za.ac.cput.service.ProductService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    public ProductController(ProductService productService, ProductRepository productRepository){
        this.productService = productService;
        this.productRepository = productRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> create(@RequestBody @Valid Product productInput){
        try {
            Product newProduct;
            
            // Check if additional fields are provided
            if (productInput.getSizes() != null || productInput.getColors() != null || productInput.getFeatures() != null) {
                // Convert comma-separated strings to lists for processing
                List<String> sizes = productInput.getSizes() != null && !productInput.getSizes().trim().isEmpty() 
                    ? List.of(productInput.getSizes().split(",")) : List.of();
                List<String> colors = productInput.getColors() != null && !productInput.getColors().trim().isEmpty() 
                    ? List.of(productInput.getColors().split(",")) : List.of();
                List<String> features = productInput.getFeatures() != null && !productInput.getFeatures().trim().isEmpty() 
                    ? List.of(productInput.getFeatures().split(",")) : List.of();
                
                newProduct = ProductFactory.buildProduct(
                        productInput.getName(),
                        productInput.getDescription(),
                        productInput.getPrice(),
                        productInput.getImageUrl(),
                        productInput.getCategory(),
                        productInput.isInStock(),
                        sizes,
                        colors,
                        features
                );
            } else {
                // Use basic factory method for backward compatibility
                newProduct = ProductFactory.buildProduct(
                        productInput.getName(),
                        productInput.getDescription(),
                        productInput.getPrice(),
                        productInput.getImageUrl(),
                        productInput.getCategory()
                );
            }
            
            if(newProduct == null){
                return ResponseEntity.badRequest().body("Invalid input fields");
            }
            
            Product saved = productService.create(newProduct);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            System.err.println("Error creating product: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error creating product: " + e.getMessage());
        }
    }


    @GetMapping("/read/{id}")
    public ResponseEntity<Product> read(@PathVariable @NotBlank String id){
        Product product = productService.read(id);
        if(product == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping("/update")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Product> update(@RequestBody @Valid Product product){
        Product updated = productService.update(product);
        if(updated == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable @NotBlank String id){
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Product> getAll(){
        return productService.getAll();
    }

    @GetMapping("/ping")
    public String ping(){
        return "Product backend is running!";
    }
}