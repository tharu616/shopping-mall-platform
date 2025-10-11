package com.mall.review;

import com.mall.review.dto.*;
import com.mall.order.OrderItemRepository;
import com.mall.order.OrderRepository;
import com.mall.order.OrderStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {
    private final ReviewRepository reviews;
    private final OrderRepository orders;        // to ensure user purchased the product
    private final OrderItemRepository orderItems;

    private void validateRating(Integer rating) {
        if (rating == null || rating < 1 || rating > 5)
            throw new IllegalArgumentException("Rating must be between 1 and 5");
    }

    private boolean userPurchasedProduct(String userEmail, Long productId) {
        // A simple check: user has any order containing this product and not cancelled
        var userOrders = orders.findByUserEmailOrderByCreatedAtDesc(userEmail);
        return userOrders.stream().anyMatch(o ->
                o.getStatus() != OrderStatus.CANCELLED &&
                        orderItems.findByOrderId(o.getId()).stream().anyMatch(oi -> oi.getProductId().equals(productId))
        );
    }

    public List<ReviewDto> myReviews(String userEmail) {
        return reviews.findByUserEmailOrderByCreatedAtDesc(userEmail).stream().map(this::toDto).toList();
    }

    public List<ReviewDto> productApproved(Long productId) {
        return reviews.findByProductIdAndStatusOrderByCreatedAtDesc(productId, ReviewStatus.APPROVED).stream().map(this::toDto).toList();
    }

    public List<ReviewDto> pending() {
        return reviews.findByStatusOrderByCreatedAtDesc(ReviewStatus.PENDING).stream().map(this::toDto).toList();
    }

    @Transactional
    public ReviewDto create(String userEmail, CreateReviewRequest req) {
        if (req.productId() == null) throw new IllegalArgumentException("productId required");
        validateRating(req.rating());
        if (!userPurchasedProduct(userEmail, req.productId()))
            throw new IllegalArgumentException("Review allowed only after purchase");
        if (reviews.existsByProductIdAndUserEmail(req.productId(), userEmail))
            throw new IllegalArgumentException("You already reviewed this product");

        var r = Review.builder()
                .productId(req.productId())
                .userEmail(userEmail)
                .status(ReviewStatus.PENDING)
                .rating(req.rating())
                .title(req.title())
                .comment(req.comment())
                .build();
        reviews.save(r);
        return toDto(r);
    }

    @Transactional
    public ReviewDto update(String userEmail, Long id, UpdateReviewRequest req) {
        var r = reviews.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!r.getUserEmail().equals(userEmail)) throw new IllegalArgumentException("Access denied");
        // policy: allow edit while PENDING
        if (r.getStatus() != ReviewStatus.PENDING) throw new IllegalArgumentException("Only pending reviews can be edited");
        if (req.rating() != null) validateRating(req.rating());
        r.setRating(req.rating() != null ? req.rating() : r.getRating());
        r.setTitle(req.title() != null ? req.title() : r.getTitle());
        r.setComment(req.comment() != null ? req.comment() : r.getComment());
        reviews.save(r);
        return toDto(r);
    }

    @Transactional
    public void delete(String userEmail, Long id) {
        var r = reviews.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (!r.getUserEmail().equals(userEmail)) throw new IllegalArgumentException("Access denied");
        reviews.delete(r);
    }

    @Transactional
    public ReviewDto approve(Long id) {
        var r = reviews.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (r.getStatus() != ReviewStatus.PENDING) throw new IllegalArgumentException("Review already moderated");
        r.setStatus(ReviewStatus.APPROVED);
        reviews.save(r);
        return toDto(r);
    }

    @Transactional
    public ReviewDto reject(Long id) {
        var r = reviews.findById(id).orElseThrow(() -> new IllegalArgumentException("Review not found"));
        if (r.getStatus() != ReviewStatus.PENDING) throw new IllegalArgumentException("Review already moderated");
        r.setStatus(ReviewStatus.REJECTED);
        reviews.save(r);
        return toDto(r);
    }

    private ReviewDto toDto(Review r) {
        return new ReviewDto(r.getId(), r.getProductId(), r.getUserEmail(), r.getStatus(), r.getRating(), r.getTitle(), r.getComment());
    }
}
