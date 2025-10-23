package com.mall.review;

import com.mall.review.dto.CreateReviewRequest;
import com.mall.review.dto.ReviewActionRequest;
import com.mall.review.dto.ReviewDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {
    private final ReviewService reviewService;

    // Create review (authenticated users)
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ReviewDto> createReview(@RequestBody CreateReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        System.out.println("createReview user=" + (userDetails!=null ? userDetails.getUsername() : "null"));
        ReviewDto review = reviewService.createReview(request, userDetails.getUsername());
        return ResponseEntity.ok(review);
    }

    // Get all reviews for a product (public - only approved)
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<ReviewDto>> getProductReviews(@PathVariable Long productId) {
        List<ReviewDto> reviews = reviewService.getApprovedReviewsByProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // Get my reviews (authenticated users)
    @GetMapping("/my-reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ReviewDto>> getMyReviews(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        List<ReviewDto> reviews = reviewService.getMyReviews(userDetails.getUsername());
        return ResponseEntity.ok(reviews);
    }

    // Get all reviews (admin only)
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDto>> getAllReviews() {
        System.out.println("Review Should work");
        List<ReviewDto> reviews = reviewService.getAllReviews();
        return ResponseEntity.ok(reviews);
    }

    // Get pending reviews (admin only)
    @GetMapping("/admin/pending")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<ReviewDto>> getPendingReviews() {
        List<ReviewDto> reviews = reviewService.getPendingReviews();
        return ResponseEntity.ok(reviews);
    }

    // Approve/Reject review (admin only)
    @PutMapping("/admin/{reviewId}/action")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ReviewDto> handleReviewAction(
            @PathVariable Long reviewId,
            @RequestBody ReviewActionRequest request
    ) {
        ReviewDto review;
        if ("APPROVE".equalsIgnoreCase(request.getAction())) {
            review = reviewService.approveReview(reviewId);
        } else if ("REJECT".equalsIgnoreCase(request.getAction())) {
            review = reviewService.rejectReview(reviewId);
        } else {
            return ResponseEntity.badRequest().build();
        }

        return ResponseEntity.ok(review);
    }

    // Delete review (admin only)
    @DeleteMapping("/admin/{reviewId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteReview(@PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseEntity.ok().build();
    }
}
