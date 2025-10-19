package com.mall.review;

import com.mall.review.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService service;

    // Public - Get approved reviews for a product
    @GetMapping("/product/{productId}")
    public List<ReviewDto> getProductReviews(@PathVariable Long productId) {
        return service.getProductReviews(productId);
    }

    // Customer - Get own reviews
    @GetMapping("/mine")
    public List<ReviewDto> getMyReviews(@AuthenticationPrincipal UserDetails principal) {
        return service.getUserReviews(principal.getUsername());
    }

    // Customer - Create review
    @PostMapping
    public ResponseEntity<ReviewDto> createReview(
            @AuthenticationPrincipal UserDetails principal,
            @RequestBody CreateReviewRequest req) {
        return ResponseEntity.ok(service.createReview(principal.getUsername(), req));
    }

    // Admin - Get pending reviews
    @GetMapping("/pending")
    public List<ReviewDto> getPendingReviews() {
        return service.getPendingReviews();
    }

    // Admin - Approve review
    @PatchMapping("/{id}/approve")
    public ResponseEntity<ReviewDto> approveReview(
            @PathVariable Long id,
            @RequestBody ReviewActionRequest req) {
        return ResponseEntity.ok(service.approveReview(id, req));
    }

    // Admin - Reject/Delete review
    @DeleteMapping("/{id}/reject")
    public ResponseEntity<Void> rejectReview(
            @PathVariable Long id,
            @RequestBody ReviewActionRequest req) {
        service.rejectReview(id, req);
        return ResponseEntity.noContent().build();
    }
}
