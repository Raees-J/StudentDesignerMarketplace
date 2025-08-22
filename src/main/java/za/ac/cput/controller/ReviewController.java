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
    public ResponseEntity<?> create(@RequestBody Review reviewInput) {
        try {
            Review newReview = ReviewFactory.buildReview(
                    reviewInput.getProductID(),
                    reviewInput.getCustomerID(),
                    reviewInput.getRating(),
                    reviewInput.getComment()
            );

            if (newReview == null) {
                return ResponseEntity.badRequest().body("Invalid input fields");
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
        if (review == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(review);
    }

    @PostMapping("/update")
    public ResponseEntity<Review> update(@RequestBody Review review) {
        Review updated = reviewService.update(review);
        if (updated == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(null);
        }
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/all")
    public List<Review> getAll() {
        return reviewService.getAll();
    }

    @GetMapping("/ping")
    public String ping() {
        return "Review backend is running!";
    }
}


