package za.ac.cput.service;

import za.ac.cput.domain.Review;

import java.util.List;

public interface IReviewService {
    Review create(Review review);
    Review read(String reviewID);
    Review update(Review review);
    void delete(String reviewID);
    List<Review> getAll();
}

