package com.example.reviewapp.factory;


import org.junit.jupiter.api.Test;
import za.ac.cput.domain.Review;
import za.ac.cput.factory.ReviewFactory;

import static org.junit.jupiter.api.Assertions.*;

class ReviewFactoryTest {

    @Test
    void testBuildReviewSuccess() {
        Review review = ReviewFactory.buildReview(
                "CUST123",
                "PROD456",
                5,
                "Excellent product!"
        );

        assertNotNull(review);
        assertNotNull(review.getReviewID()); // UUID should be auto-generated
        assertEquals("CUST123", review.getCustomerID());
        assertEquals("PROD456", review.getProductID());
        assertEquals(5, review.getRating());
        assertEquals("Excellent product!", review.getComment());
    }

    @Test
    void testBuildReviewWithInvalidRating() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ReviewFactory.buildReview("CUST123", "PROD456", 10, "Bad rating"); // invalid rating > 5
        });

        assertEquals("Rating must be between 1 and 5", exception.getMessage());
    }

    @Test
    void testBuildReviewWithEmptyFields() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ReviewFactory.buildReview("", "PROD456", 3, ""); // invalid empty customerID and comment
        });

        assertEquals("CustomerID, ProductID, and Comment cannot be empty", exception.getMessage());
    }

    @Test
    void testBuildReviewWithNullFields() {
        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            ReviewFactory.buildReview(null, null, 4, null); // null values
        });

        assertEquals("CustomerID, ProductID, and Comment cannot be empty", exception.getMessage());
    }
}

