package com.mall.payment;

import com.mall.order.Order;
import com.mall.order.OrderRepository;
import com.mall.order.OrderStatus;
import com.mall.payment.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository payments;
    private final OrderRepository orders;

    public List<PaymentListDto> myPayments(String userEmail) {
        return payments.findByUserEmailOrderByCreatedAtDesc(userEmail).stream()
                .map(this::toListDto)
                .toList();
    }

    public List<PaymentListDto> pending() {
        return payments.findByStatusOrderByCreatedAtDesc(PaymentStatus.PENDING).stream()
                .map(this::toListDto)
                .toList();
    }

    public PaymentDto get(Long id) {
        return toDto(payments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found")));
    }

    @Transactional
    public PaymentDto upload(String userEmail, UploadPaymentRequest req) {
        // Basic validation
        if (req.orderId() == null || req.amount() == null || req.amount() <= 0
                || req.paymentMethod() == null || req.paymentMethod().isBlank())
            throw new IllegalArgumentException("Invalid payment data");

        if (req.reference() != null && !req.reference().isBlank()
                && payments.existsByReference(req.reference().trim().toUpperCase()))
            throw new IllegalArgumentException("Reference already used");

        // Validate payment method specific fields
        validatePaymentMethod(req);

        Order order = orders.findById(req.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getUserEmail().equals(userEmail))
            throw new IllegalArgumentException("Cannot upload payment for another user");

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED)
            throw new IllegalArgumentException("Order cannot accept payments in this status");

        var p = Payment.builder()
                .orderId(order.getId())
                .userEmail(userEmail)
                .status(PaymentStatus.PENDING)
                .paymentMethod(req.paymentMethod())
                .reference(req.reference() != null ? req.reference().trim().toUpperCase() : generateReference())
                .amount(req.amount())
                .receiptUrl(req.receiptUrl())
                .build();

        // Set payment method specific fields
        switch (req.paymentMethod()) {
            case "CARD" -> {
                p.setCardLast4(maskCard(req.cardNumber()));
                p.setCardHolderName(req.cardHolderName());
            }
            case "BANK_TRANSFER" -> {
                p.setBankName(req.bankName());
                p.setAccountLast4(maskAccount(req.accountNumber()));
                p.setAccountHolderName(req.accountHolderName());
                p.setBranchCode(req.branchCode());
                p.setTransferDate(req.transferDate());
            }
            case "PAYPAL" -> {
                p.setPaypalEmail(req.paypalEmail());
                p.setPaypalTransactionId(req.paypalTransactionId());
            }
            case "CASH_ON_DELIVERY" -> {
                // No additional fields needed, auto-approve
                p.setStatus(PaymentStatus.VERIFIED);
            }
        }

        payments.save(p);
        return toDto(p);
    }

    private void validatePaymentMethod(UploadPaymentRequest req) {
        switch (req.paymentMethod()) {
            case "CARD" -> {
                if (req.cardNumber() == null || req.cardNumber().length() < 13)
                    throw new IllegalArgumentException("Invalid card number");
                if (req.cardHolderName() == null || req.cardHolderName().isBlank())
                    throw new IllegalArgumentException("Card holder name required");
                if (req.cardExpiryDate() == null || req.cardExpiryDate().isBlank())
                    throw new IllegalArgumentException("Card expiry date required");
                if (req.cardCvv() == null || req.cardCvv().length() != 3)
                    throw new IllegalArgumentException("Invalid CVV");
            }
            case "BANK_TRANSFER" -> {
                if (req.bankName() == null || req.bankName().isBlank())
                    throw new IllegalArgumentException("Bank name required");
                if (req.accountNumber() == null || req.accountNumber().isBlank())
                    throw new IllegalArgumentException("Account number required");
                if (req.accountHolderName() == null || req.accountHolderName().isBlank())
                    throw new IllegalArgumentException("Account holder name required");
            }
            case "PAYPAL" -> {
                if (req.paypalEmail() == null || req.paypalEmail().isBlank())
                    throw new IllegalArgumentException("PayPal email required");
                if (req.paypalTransactionId() == null || req.paypalTransactionId().isBlank())
                    throw new IllegalArgumentException("PayPal transaction ID required");
            }
            case "CASH_ON_DELIVERY" -> {
                // No validation needed
            }
            default -> throw new IllegalArgumentException("Invalid payment method");
        }
    }

    private String maskCard(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) return "****";
        return cardNumber.substring(cardNumber.length() - 4);
    }

    private String maskAccount(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) return "****";
        return accountNumber.substring(accountNumber.length() - 4);
    }

    private String generateReference() {
        return "REF" + System.currentTimeMillis();
    }

    @Transactional
    public PaymentDto approve(Long id, ReviewRequest review) {
        var p = payments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (p.getStatus() != PaymentStatus.PENDING)
            throw new IllegalArgumentException("Payment already reviewed");

        p.setStatus(PaymentStatus.VERIFIED);
        p.setAdminNote(review == null ? null : review.adminNote());
        payments.save(p);

        var order = orders.findById(p.getOrderId()).orElse(null);
        if (order != null && order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
            orders.save(order);
        }

        return toDto(p);
    }

    @Transactional
    public PaymentDto reject(Long id, ReviewRequest review) {
        var p = payments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        if (p.getStatus() != PaymentStatus.PENDING)
            throw new IllegalArgumentException("Payment already reviewed");

        p.setStatus(PaymentStatus.REJECTED);
        p.setAdminNote(review == null ? null : review.adminNote());
        payments.save(p);
        return toDto(p);
    }

    private PaymentDto toDto(Payment p) {
        return new PaymentDto(
                p.getId(),
                p.getOrderId(),
                p.getUserEmail(),
                p.getStatus(),
                p.getPaymentMethod(),
                p.getReference(),
                p.getAmount(),
                p.getReceiptUrl(),
                p.getCardLast4(),
                p.getCardHolderName(),
                p.getBankName(),
                p.getAccountLast4(),
                p.getAccountHolderName(),
                p.getBranchCode(),
                p.getTransferDate(),
                p.getPaypalEmail(),
                p.getPaypalTransactionId(),
                p.getAdminNote()
        );
    }

    private PaymentListDto toListDto(Payment p) {
        return new PaymentListDto(
                p.getId(),
                p.getOrderId(),
                p.getStatus(),
                p.getPaymentMethod(),
                p.getReference(),
                p.getAmount()
        );
    }
}
