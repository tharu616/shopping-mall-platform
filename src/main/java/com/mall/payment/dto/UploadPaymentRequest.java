package com.mall.payment.dto;

public record UploadPaymentRequest(Long orderId, Double amount, String reference, String receiptUrl) {}
