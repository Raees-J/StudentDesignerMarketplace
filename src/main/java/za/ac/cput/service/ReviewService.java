package za.ac.cput.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import za.ac.cput.domain.Review;
import za.ac.cput.repository.ReviewRepository;

import java.util.List;

@Service
public class ReviewService implements IReviewService {

    private final ReviewRepository repository;

    @Autowired
    public ReviewService(ReviewRepository repository) {
        this.repository = repository;
    }

    @Override
    public Review create(Review review) {
        Review newReview = new Review.Builder()
                .setReviewID(review.getReviewID())
                .setProductID(review.getProductID())
                .setCustomerID(review.getCustomerID())
                .setRating(review.getRating())
                .setComment(review.getComment())
                .build();

        return repository.save(newReview);
    }

    @Override
    public Review read(String reviewID) {
        return repository.findById(reviewID).orElse(null);
    }

    @Override
    public Review update(Review review) {
        if (repository.existsById(review.getReviewID())) {
            Review updatedReview = new Review.Builder()
                    .setReviewID(review.getReviewID())
                    .setProductID(review.getProductID())
                    .setCustomerID(review.getCustomerID())
                    .setRating(review.getRating())
                    .setComment(review.getComment())
                    .build();

            return repository.save(updatedReview);
        } else {
            System.out.println("Review with ID " + review.getReviewID() + " does not exist.");
            return null;
        }
    }

    @Override
    public void delete(String reviewID) {
        repository.deleteById(reviewID);
    }

    @Override
    public List<Review> getAll() {
        return repository.findAll();
    }
}


