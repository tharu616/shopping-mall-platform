package com.mall.review.dto;

import lombok.Data;

@Data
public class CreateReviewRequest {
    private Long productId;
    private Integer rating;
    private String comment;
}