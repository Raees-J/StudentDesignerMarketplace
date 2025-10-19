package za.ac.cput.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import za.ac.cput.domain.Product;
import za.ac.cput.repository.ProductRepository;

@Service
public class ProductService implements IProductService {

    private final ProductRepository repository;

    @Autowired
    public ProductService(ProductRepository repository){
        this.repository = repository;
    }

    @Override
    public Product create(Product product){
        Product newProduct = new Product.Builder()
                .setProductID(product.getProductID())
                .setName(product.getName())
                .setDescription(product.getDescription())
                .setPrice(product.getPrice())
                .setImageUrl(product.getImageUrl())
                .setCategory(product.getCategory())
                .setInStock(product.isInStock())
                .setSizes(product.getSizes())
                .setColors(product.getColors())
                .setFeatures(product.getFeatures())
                .build();
        return repository.save(newProduct);
    }

    @Override
    public Product read(String productID){
        return repository.findById(productID).orElse(null);
    }

    @Override
    public Product update(Product product){
        if(repository.existsById(product.getProductID())){
            Product updated = new Product.Builder()
                    .setProductID(product.getProductID())
                    .setName(product.getName())
                    .setDescription(product.getDescription())
                    .setPrice(product.getPrice())
                    .setImageUrl(product.getImageUrl())
                    .setCategory(product.getCategory())
                    .setInStock(product.isInStock())
                    .setSizes(product.getSizes())
                    .setColors(product.getColors())
                    .setFeatures(product.getFeatures())
                    .build();
            return repository.save(updated);
        }
        return null;
    }

    @Override
    public void delete(String productID){
        repository.deleteById(productID);
    }

    @Override
    public List<Product> getAll(){
        return repository.findAll();
    }
}