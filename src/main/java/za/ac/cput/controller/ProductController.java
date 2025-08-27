package za.ac.cput.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Product;
import za.ac.cput.factory.ProductFactory;
import za.ac.cput.repository.ProductRepository;
import za.ac.cput.service.ProductService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService productService;
    private final ProductRepository productRepository;

    @Autowired
    public ProductController(ProductService productService, ProductRepository productRepository){
        this.productService = productService;
        this.productRepository = productRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Product productInput){
        Product newProduct = ProductFactory.buildProduct(
                productInput.getName(),
                productInput.getDescription(),
                productInput.getPrice()
        );
        if(newProduct == null){
            return ResponseEntity.badRequest().body("Invalid input fields");
        }
        Product saved = productService.create(newProduct);
        return ResponseEntity.ok(saved);
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Product> read(@PathVariable String id){
        Product product = productService.read(id);
        if(product == null){
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(product);
    }

    @PostMapping("/update")
    public ResponseEntity<Product> update(@RequestBody Product product){
        Product updated = productService.update(product);
        if(updated == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id){
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public List<Product> getAll(){
        return productService.getAll();
    }

    @GetMapping("/ping")
    public String ping(){
        return "Product backend is running!";
    }
}