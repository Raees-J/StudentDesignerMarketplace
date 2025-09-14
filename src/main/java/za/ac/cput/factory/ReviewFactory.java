package za.ac.cput.factory;

import za.ac.cput.domain.Review;
import za.ac.cput.util.Helper;

import java.util.UUID;

public class ReviewFactory {

        public static Review buildReview(String customerID, String productID, int rating, String comment) {

            if (Helper.isNullOrEmpty(customerID) || Helper.isNullOrEmpty(productID) || Helper.isNullOrEmpty(comment)) {
                throw new IllegalArgumentException("CustomerID, ProductID, and Comment cannot be empty");
            }

            if (rating < 1 || rating > 5) {
                throw new IllegalArgumentException("Rating must be between 1 and 5");
            }

            String reviewID = UUID.randomUUID().toString();

            return new Review.Builder()
                    .setReviewID(reviewID)
                    .setCustomerID(customerID)
                    .setProductID(productID)
                    .setRating(rating)
                    .setComment(comment)
                    .build();
        }
    }