package com.mall.payment.dto;

public record UploadPaymentRequest(
        Long orderId,
        String paymentMethod, // NEW: CARD, BANK_TRANSFER, PAYPAL, CASH_ON_DELIVERY
        Double amount,
        String reference,
        String receiptUrl,

        // Card payment fields
        String cardNumber,
        String cardHolderName,
        String cardExpiryDate,
        String cardCvv,

        // Bank transfer fields
        String bankName,
        String accountNumber,
        String accountHolderName,
        String branchCode,
        String transferDate,

        // PayPal fields
        String paypalEmail,
        String paypalTransactionId
) {}
