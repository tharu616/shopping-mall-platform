package com.mall.review.dto;

import lombok.Data;

@Data
public class ReviewActionRequest {
    private String action; // "APPROVE" or "REJECT"
}