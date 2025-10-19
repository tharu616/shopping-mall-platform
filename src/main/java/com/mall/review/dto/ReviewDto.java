package com.mall.review.dto;

public record ReviewDto(
        Long id,
        Long productId,
        String userEmail,
        Integer rating,
        String comment,
        Boolean approved,
        String adminNote,
        java.time.Instant createdAt
) {}
