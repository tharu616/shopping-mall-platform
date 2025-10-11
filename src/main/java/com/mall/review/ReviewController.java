package com.mall.review;

import com.mall.review.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reviews")
public class ReviewController {
    private final ReviewService service;
    public ReviewController(ReviewService s) { this.service = s; }

    // Customer
    @PostMapping
    public ResponseEntity<ReviewDto> create(@AuthenticationPrincipal UserDetails principal, @RequestBody CreateReviewRequest req) {
        var email = principal.getUsername();
        return ResponseEntity.ok(service.create(email, req));
    }

    @GetMapping("/mine")
    public List<ReviewDto> mine(@AuthenticationPrincipal UserDetails principal) {
        var email = principal.getUsername();
        return service.myReviews(email);
    }

    @PatchMapping("/{id}")
    public ReviewDto update(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id, @RequestBody UpdateReviewRequest req) {
        var email = principal.getUsername();
        return service.update(email, id, req);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var email = principal.getUsername();
        service.delete(email, id);
        return ResponseEntity.noContent().build();
    }

    // Public product reviews (approved only)
    @GetMapping("/product/{productId}")
    public List<ReviewDto> productApproved(@PathVariable Long productId) {
        return service.productApproved(productId);
    }

    // Admin moderation
    @GetMapping("/pending")
    public List<ReviewDto> pending() { return service.pending(); }

    @PatchMapping("/{id}/approve")
    public ReviewDto approve(@PathVariable Long id) { return service.approve(id); }

    @PatchMapping("/{id}/reject")
    public ReviewDto reject(@PathVariable Long id) { return service.reject(id); }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
