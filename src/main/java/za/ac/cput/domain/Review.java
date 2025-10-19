package za.ac.cput.domain;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;

import java.util.Objects;

@Entity
public class Review {
    @Id
    private String reviewID;
    private String productID;
    private String customerID;
    private int rating;
    private String comment;


    protected Review() {}

    private Review(Builder builder) {
        this.reviewID = builder.reviewID;
        this.productID = builder.productID;
        this.customerID = builder.customerID;
        this.rating = builder.rating;
        this.comment = builder.comment;
    }

    // Getters
    public String getReviewID() {
        return reviewID;
    }

    public String getProductID() {
        return productID;
    }

    public String getCustomerID() {
        return customerID;
    }

    public int getRating() {
        return rating;
    }

    public String getComment() {
        return comment;
    }

    // equals & hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Review review = (Review) o;
        return rating == review.rating &&
                Objects.equals(reviewID, review.reviewID) &&
                Objects.equals(productID, review.productID) &&
                Objects.equals(customerID, review.customerID) &&
                Objects.equals(comment, review.comment);
    }

    @Override
    public int hashCode() {
        return Objects.hash(reviewID, productID, customerID, rating, comment);
    }

    // toString
    @Override
    public String toString() {
        return "Review{" +
                "reviewID='" + reviewID + '\'' +
                ", productID='" + productID + '\'' +
                ", customerID='" + customerID + '\'' +
                ", rating=" + rating +
                ", comment='" + comment + '\'' +
                '}';
    }

    // Builder
    public static class Builder {
        private String reviewID;
        private String productID;
        private String customerID;
        private int rating;
        private String comment;

        public Builder setReviewID(String reviewID) {
            this.reviewID = reviewID;
            return this;
        }

        public Builder setProductID(String productID) {
            this.productID = productID;
            return this;
        }

        public Builder setCustomerID(String customerID) {
            this.customerID = customerID;
            return this;
        }

        public Builder setRating(int rating) {
            this.rating = rating;
            return this;
        }

        public Builder setComment(String comment) {
            this.comment = comment;
            return this;
        }

        public Builder copy(Review review) {
            this.reviewID = review.reviewID;
            this.productID = review.productID;
            this.customerID = review.customerID;
            this.rating = review.rating;
            this.comment = review.comment;
            return this;
        }

        public Review build() {
            return new Review(this);
        }
    }
}

