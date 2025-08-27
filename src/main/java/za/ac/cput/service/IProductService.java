package za.ac.cput.service;

import za.ac.cput.domain.Product;

import java.util.List;

public interface IProductService {
    Product create(Product product);
    Product read(String productID);
    Product update(Product product);
    void delete(String productID);
    List<Product> getAll();
}