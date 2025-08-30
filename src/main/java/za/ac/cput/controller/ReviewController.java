package za.ac.cput.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import za.ac.cput.domain.Review;
import za.ac.cput.factory.ReviewFactory;
import za.ac.cput.repository.ReviewRepository;
import za.ac.cput.service.ReviewService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    @Autowired
    public ReviewController(ReviewService reviewService, ReviewRepository reviewRepository) {
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
    }

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody Review input) {
        try {
            Review newReview = ReviewFactory.buildReview(
                    input.getCustomerID(),
                    input.getProductID(),
                    input.getRating(),
                    input.getComment()
            );

            if (newReview == null) {
                return ResponseEntity.badRequest().body("Invalid review input");
            }

            Review saved = reviewService.create(newReview);
            return ResponseEntity.ok(saved);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/read/{id}")
    public ResponseEntity<Review> read(@PathVariable String id) {
        Review review = reviewService.read(id);
        return (review != null) ?
                ResponseEntity.ok(review) :
                ResponseEntity.notFound().build();
    }

    @PostMapping("/update")
    public ResponseEntity<?> update(@RequestBody Review review) {
        Review updated = reviewService.update(review);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Review with ID " + review.getReviewID() + " not found.");
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        reviewService.delete(id);
        return ResponseEntity.ok("Deleted review with ID: " + id);
    }

    @GetMapping("/all")
    public List<Review> getAll() {
        return reviewService.getAll();
    }

    @GetMapping("/customer/{customerID}")
    public List<Review> getByCustomer(@PathVariable String customerID) {
        return reviewService.getReviewsByCustomerID(customerID);
    }

    @GetMapping("/product/{productID}")
    public List<Review> getByProduct(@PathVariable String productID) {
        return reviewService.getReviewsByProductID(productID);
    }

    @GetMapping("/rating/{rating}")
    public List<Review> getByRating(@PathVariable int rating) {
        return reviewService.getReviewsByRating(rating);
    }

    @GetMapping("/search")
    public List<Review> searchByComment(@RequestParam String keyword) {
        return reviewService.searchReviewsByComment(keyword);
    }

    @GetMapping("/ping")
    public String ping() {
        return "Review backend is running!";
    }
}