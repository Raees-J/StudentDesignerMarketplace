package za.ac.cput.domain;

import java.util.Objects;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;

/**
 * Product entity for Student Designer Marketplace.
 */
@Entity
public class Product {
    @Id
    private String productID;
    private String name;
    @Lob
    private String description;
    private double price;
    @Lob
    private String imageUrl;
    private String category;
    private boolean inStock;
    @Lob
    private String sizes; // Stored as comma-separated string
    @Lob
    private String colors; // Stored as comma-separated string
    @Lob
    private String features; // Stored as comma-separated string

    protected Product(){}

    private Product(Builder builder){
        this.productID = builder.productID;
        this.name = builder.name;
        this.description = builder.description;
        this.price = builder.price;
        this.imageUrl = builder.imageUrl;
        this.category = builder.category;
        this.inStock = builder.inStock;
        this.sizes = builder.sizes;
        this.colors = builder.colors;
        this.features = builder.features;
    }

    public String getProductID(){return productID;}
    public String getName(){return name;}
    public String getDescription(){return description;}
    public double getPrice(){return price;}
    public String getImageUrl(){return imageUrl;}
    public String getCategory(){return category;}
    public boolean isInStock(){return inStock;}
    public String getSizes(){return sizes;}
    public String getColors(){return colors;}
    public String getFeatures(){return features;}

    @Override
    public boolean equals(Object o){
        if(this==o) return true;
        if(o==null || getClass()!=o.getClass()) return false;
        Product product=(Product)o;
    return Double.compare(product.price, price)==0 &&
        inStock == product.inStock &&
        Objects.equals(productID, product.productID) &&
        Objects.equals(name, product.name) &&
        Objects.equals(description, product.description) &&
        Objects.equals(imageUrl, product.imageUrl) &&
        Objects.equals(category, product.category) &&
        Objects.equals(sizes, product.sizes) &&
        Objects.equals(colors, product.colors) &&
        Objects.equals(features, product.features);
    }

    @Override
    public int hashCode(){
    return Objects.hash(productID, name, description, price, imageUrl, category, inStock, sizes, colors, features);
    }

    @Override
    public String toString(){
    return "Product{" +
        "productID='" + productID + '\'' +
        ", name='" + name + '\'' +
        ", description='" + description + '\'' +
        ", price=" + price +
        ", imageUrl='" + imageUrl + '\'' +
        ", category='" + category + '\'' +
        ", inStock=" + inStock +
        ", sizes='" + sizes + '\'' +
        ", colors='" + colors + '\'' +
        ", features='" + features + '\'' +
        '}';
    }

    public static class Builder {
    private String productID;
    private String name;
    private String description;
    private double price;
    private String imageUrl;
    private String category;
    private boolean inStock;
    private String sizes;
    private String colors;
    private String features;

    public Builder setProductID(String productID){this.productID=productID;return this;}
    public Builder setName(String name){this.name=name;return this;}
    public Builder setDescription(String description){this.description=description;return this;}
    public Builder setPrice(double price){this.price=price;return this;}
    public Builder setImageUrl(String imageUrl){this.imageUrl=imageUrl;return this;}
    public Builder setCategory(String category){this.category=category;return this;}
    public Builder setInStock(boolean inStock){this.inStock=inStock;return this;}
    public Builder setSizes(String sizes){this.sizes=sizes;return this;}
    public Builder setColors(String colors){this.colors=colors;return this;}
    public Builder setFeatures(String features){this.features=features;return this;}

        public Builder copy(Product product){
            this.productID=product.productID;
            this.name=product.name;
            this.description=product.description;
            this.price=product.price;
            this.imageUrl=product.imageUrl;
            this.category=product.category;
            this.inStock=product.inStock;
            this.sizes=product.sizes;
            this.colors=product.colors;
            this.features=product.features;
            return this;
        }

        public Product build(){return new Product(this);}
    }
}