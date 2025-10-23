package com.mall.review;

import com.mall.review.Review;
import com.mall.review.ReviewStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductId(Long productId);
    List<Review> findByProductIdAndStatus(Long productId, ReviewStatus status);
    List<Review> findByUserId(Long userId);
    List<Review> findByStatus(ReviewStatus status);
    List<Review> findByOrderByCreatedAtDesc();
}