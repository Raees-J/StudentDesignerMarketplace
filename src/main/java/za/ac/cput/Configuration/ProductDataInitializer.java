package za.ac.cput.Configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import za.ac.cput.domain.Product;
import za.ac.cput.factory.ProductFactory;
import za.ac.cput.repository.ProductRepository;

import java.util.Arrays;
import java.util.List;

/**
 * Seeds initial products into the database.
 * Inserts products from the "All Products" category if they are missing.
 */
@Component
public class ProductDataInitializer implements CommandLineRunner {
    private final ProductRepository productRepository;

    public ProductDataInitializer(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public void run(String... args) {
        // Only seed when the table does not already contain these products
        if (productRepository.count() <= 2) {
            List<Product> products = Arrays.asList(
                    ProductFactory.buildProduct("Dress with skirt", "Premium cotton dress with stylish skirt. Perfect for students and alumni.", 299, "/assets/images/outfit 1.jpg"),
                    ProductFactory.buildProduct("Coat with hoodie", "Comfortable fleece coat with attachable hoodie. Ideal for cooler weather.", 599, "/assets/images/outfit 2.jpg"),
                    ProductFactory.buildProduct("Stylish outfit", "Adjustable 2 piece .", 199, "/assets/images/outfit 3.jpg"),
                    ProductFactory.buildProduct("Bowtie and waistband", "Essential add on to your suit or shirt.", 399, "/assets/images/bowtie.jpeg"),
                    ProductFactory.buildProduct("Framed poster", "Stylish arabic text poster/ artwork.", 2499, "/assets/images/poster.jpg"),
                    ProductFactory.buildProduct("Forge", "hang all items from keys to bottles to coats.", 899, "/assets/images/wallHanger.png"),
                    ProductFactory.buildProduct("Coffea machine", "ideal houshold product for everyday coffea.", 4999, "/assets/images/coffeaMach.jpg"),
                    ProductFactory.buildProduct("watertank bag", "Hikes, walks in the park, to even spring and marathons.Drink while working out .", 1899, "/assets/images/condo-3L.jpg"),
                    ProductFactory.buildProduct("Laptop Bag", "Padded laptop bag.", 699, "/assets/images/Brownbag.jpeg"),
                    ProductFactory.buildProduct("duffle bag", "Multiple compartment for everyday use.", 249, "/assets/images/ChocBag.jpeg"),
                    ProductFactory.buildProduct("University Diary", "old school ook for your newst thoughts and designs.", 199, "/assets/images/Diary.jpeg"),
                    ProductFactory.buildProduct("University Bag", "Padded laptop bag with university branding.", 350, "/assets/images/DoublestBag.jpeg"),
                    ProductFactory.buildProduct("GreenBag", "stylish and comfortable.", 699, "/assets/images/Greenbag.jpeg"),
                    ProductFactory.buildProduct("handBag", "easy use and carry.", 699, "/assets/images/handBag.jpeg"),
                    ProductFactory.buildProduct("headphones", "listen to whatever you want to whenever you want to.", 250, "/assets/images/headphones.png"),
                    ProductFactory.buildProduct("Lamp", "studying in the dark to being able to use as a nightlight .", 299, "/assets/images/lamp.png"),
                    ProductFactory.buildProduct("Leather bag", "Padded bag with classic design.", 699, "/assets/images/leatherBg.jpeg"),
                    ProductFactory.buildProduct("wallet", "keep your student card, cash and other valuables in.", 99, "/assets/images/wallet.jpeg"),
                    ProductFactory.buildProduct("speaker", "listen to podcast and music anywhere.", 499, "/assets/images/Speaker render 1.png")
            );

            products.stream()
                    .filter(product -> product != null)
                    .forEach(productRepository::save);
        }
    }
}