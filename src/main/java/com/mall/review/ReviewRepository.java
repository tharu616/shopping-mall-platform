package com.mall.review;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndApprovedOrderByCreatedAtDesc(Long productId, Boolean approved);
    List<Review> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Review> findByApprovedOrderByCreatedAtDesc(Boolean approved);
}
