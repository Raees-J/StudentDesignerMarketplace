package za.ac.cput.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import java.util.Objects;

/**
 * Product entity for Student Designer Marketplace.
 */
@Entity
public class Product {
    @Id
    private String productID;
    private String name;
    private String description;
    private double price;

    protected Product(){}

    private Product(Builder builder){
        this.productID = builder.productID;
        this.name = builder.name;
        this.description = builder.description;
        this.price = builder.price;
    }

    public String getProductID(){return productID;}
    public String getName(){return name;}
    public String getDescription(){return description;}
    public double getPrice(){return price;}

    @Override
    public boolean equals(Object o){
        if(this==o) return true;
        if(o==null || getClass()!=o.getClass()) return false;
        Product product=(Product)o;
        return Double.compare(product.price, price)==0 &&
                Objects.equals(productID, product.productID) &&
                Objects.equals(name, product.name) &&
                Objects.equals(description, product.description);
    }

    @Override
    public int hashCode(){
        return Objects.hash(productID, name, description, price);
    }

    @Override
    public String toString(){
        return "Product{" +
                "productID='" + productID + '\'' +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", price=" + price +
                '}';
    }

    public static class Builder {
        private String productID;
        private String name;
        private String description;
        private double price;

        public Builder setProductID(String productID){this.productID=productID;return this;}
        public Builder setName(String name){this.name=name;return this;}
        public Builder setDescription(String description){this.description=description;return this;}
        public Builder setPrice(double price){this.price=price;return this;}

        public Builder copy(Product product){
            this.productID=product.productID;
            this.name=product.name;
            this.description=product.description;
            this.price=product.price;
            return this;
        }

        public Product build(){return new Product(this);}
    }
}