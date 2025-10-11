package com.mall.review.dto;

import com.mall.review.ReviewStatus ; // remove spaces; added to avoid accidental formatting issues


public record ReviewDto(Long id, Long productId, String userEmail, ReviewStatus status, Integer rating, String title, String comment) {}
