package com.mall.payment.dto;

public record PaymentHistoryDto(
        Long id,
        Long orderId,
        String userEmail,
        Double amount,
        String status,
        String reference
) {}
