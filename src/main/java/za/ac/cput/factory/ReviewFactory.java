package za.ac.cput.factory;

import za.ac.cput.domain.Review;

import java.util.UUID;

public class ReviewFactory {

    public static Review buildReview(String productID, String customerID, int rating, String comment) {

        String reviewID = UUID.randomUUID().toString();

        return new Review.Builder()
                .setReviewID(reviewID)
                .setProductID(productID)
                .setCustomerID(customerID)
                .setRating(rating)
                .setComment(comment)
                .build();
    }
}

