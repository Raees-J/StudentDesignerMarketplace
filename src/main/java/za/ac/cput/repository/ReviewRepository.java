package za.ac.cput.repository;



import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.ac.cput.domain.Review;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    List<Review> findByCustomerID(String customerID);
    List<Review> findByProductID(String productID);
    List<Review> findByRating(int rating);
    List<Review> findByCommentContainingIgnoreCase(String keyword);
}

