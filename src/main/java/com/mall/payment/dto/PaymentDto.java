package com.mall.payment.dto;

import com.mall.payment.PaymentStatus;

public record PaymentDto(Long id, Long orderId, String userEmail, PaymentStatus status, String reference, Double amount, String receiptUrl, String adminNote) {}
