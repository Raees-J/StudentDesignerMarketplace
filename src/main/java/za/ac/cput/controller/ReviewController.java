package za.ac.cput.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import za.ac.cput.domain.Review;
import za.ac.cput.factory.ReviewFactory;
import za.ac.cput.repository.ReviewRepository;
import za.ac.cput.service.ReviewService;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/reviews")
public class ReviewController {

    private final ReviewService reviewService;
    private final ReviewRepository reviewRepository;

    public ReviewController(ReviewService reviewService, ReviewRepository reviewRepository) {
        this.reviewService = reviewService;
        this.reviewRepository = reviewRepository;
    }

    @PostMapping("/create")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> create(@RequestBody @Valid Review input) {
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
    // Public endpoint - reviews can be read by anyone
    public ResponseEntity<Review> read(@PathVariable @NotBlank String id) {
        Review review = reviewService.read(id);
        return (review != null) ?
                ResponseEntity.ok(review) :
                ResponseEntity.notFound().build();
    }

    @PostMapping("/update")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> update(@RequestBody @Valid Review review) {
        Review updated = reviewService.update(review);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Review with ID " + review.getReviewID() + " not found.");
    }

    @DeleteMapping("/delete/{id}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public ResponseEntity<?> delete(@PathVariable @NotBlank String id) {
        reviewService.delete(id);
        return ResponseEntity.ok("Deleted review with ID: " + id);
    }

    @GetMapping("/all")
    // Public endpoint - all reviews can be read by anyone
    public List<Review> getAll() {
        return reviewService.getAll();
    }

    @GetMapping("/customer/{customerID}")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'ADMIN')")
    public List<Review> getByCustomer(@PathVariable @NotBlank String customerID) {
        return reviewService.getReviewsByCustomerID(customerID);
    }

    @GetMapping("/product/{productID}")
    // Public endpoint - product reviews can be read by anyone
    public List<Review> getByProduct(@PathVariable @NotBlank String productID) {
        return reviewService.getReviewsByProductID(productID);
    }

    @GetMapping("/rating/{rating}")
    // Public endpoint - reviews by rating can be read by anyone
    public List<Review> getByRating(@PathVariable int rating) {
        return reviewService.getReviewsByRating(rating);
    }

    @GetMapping("/search")
    // Public endpoint - search reviews can be read by anyone
    public List<Review> searchByComment(@RequestParam @NotBlank String keyword) {
        return reviewService.searchReviewsByComment(keyword);
    }

    @GetMapping("/ping")
    public String ping() {
        return "Review backend is running!";
    }
}