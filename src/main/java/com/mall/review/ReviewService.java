package com.mall.review;

import com.mall.review.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository repo;

    public List<ReviewDto> getProductReviews(Long productId) {
        return repo.findByProductIdAndApprovedOrderByCreatedAtDesc(productId, true).stream()
                .map(this::toDto).toList();
    }

    public List<ReviewDto> getUserReviews(String userEmail) {
        return repo.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(this::toDto).toList();
    }

    public List<ReviewDto> getPendingReviews() {
        return repo.findByApprovedOrderByCreatedAtDesc(false).stream()
                .map(this::toDto).toList();
    }

    @Transactional
    public ReviewDto createReview(String userEmail, CreateReviewRequest req) {
        if (req.rating() < 1 || req.rating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }

        var review = Review.builder()
                .productId(req.productId())
                .userEmail(userEmail)
                .rating(req.rating())
                .comment(req.comment())
                .approved(false)
                .build();

        return toDto(repo.save(review));
    }

    @Transactional
    public ReviewDto approveReview(Long id, ReviewActionRequest req) {
        var review = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setApproved(true);
        review.setAdminNote(req.adminNote());
        return toDto(repo.save(review));
    }

    @Transactional
    public void rejectReview(Long id, ReviewActionRequest req) {
        var review = repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        review.setAdminNote(req.adminNote());
        repo.delete(review);
    }

    private ReviewDto toDto(Review r) {
        return new ReviewDto(
                r.getId(),
                r.getProductId(),
                r.getUserEmail(),
                r.getRating(),
                r.getComment(),
                r.getApproved(),
                r.getAdminNote(),
                r.getCreatedAt()
        );
    }
}
