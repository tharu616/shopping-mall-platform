package com.mall.payment.dto;

import com.mall.payment.PaymentStatus;

public record PaymentListDto(
        Long id,
        Long orderId,
        PaymentStatus status,
        String paymentMethod,
        String reference,
        Double amount
) {}
