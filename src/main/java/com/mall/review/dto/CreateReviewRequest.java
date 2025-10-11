package com.mall.review.dto;

public record CreateReviewRequest(Long productId, Integer rating, String title, String comment) {}
