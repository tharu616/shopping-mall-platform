package com.mall.payment.dto;

import com.mall.payment.PaymentStatus;

public record PaymentDto(
        Long id,
        Long orderId,
        String userEmail,
        PaymentStatus status,
        String paymentMethod,
        String reference,
        Double amount,
        String receiptUrl,
        String cardLast4,
        String cardHolderName,
        String bankName,
        String accountLast4,
        String accountHolderName,
        String branchCode,
        String transferDate,
        String paypalEmail,
        String paypalTransactionId,
        String adminNote
) {}
