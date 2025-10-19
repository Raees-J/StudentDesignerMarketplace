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
        return repository.save(review);
    }

    @Override
    public Review read(String reviewID) {
        return repository.findById(reviewID).orElse(null);
    }

    @Override
    public Review update(Review review) {
        if (repository.existsById(review.getReviewID())) {
            return repository.save(review);
        }
        return null;
    }

    @Override
    public void delete(String reviewID) {
        repository.deleteById(reviewID);
    }

    @Override
    public List<Review> getAll() {
        return repository.findAll();
    }

    public List<Review> getReviewsByCustomerID(String customerID) {
        return repository.findByCustomerID(customerID);
    }

    public List<Review> getReviewsByProductID(String productID) {
        return repository.findByProductID(productID);
    }

    public List<Review> getReviewsByRating(int rating) {
        return repository.findByRating(rating);
    }

    public List<Review> searchReviewsByComment(String keyword) {
        return repository.findByCommentContainingIgnoreCase(keyword);
    }
}


