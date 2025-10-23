package com.mall.payment;

import com.mall.order.Order;
import com.mall.order.OrderRepository;
import com.mall.order.OrderStatus;
import com.mall.payment.dto.*;
import com.mall.payment.validation.PaymentValidatorFactory;
import com.mall.payment.state.PaymentStateFactory;
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
        // 1. Validate basic fields
        validateBasicFields(req);

        // 2. Validate payment method specific fields using Strategy pattern
        var validator = PaymentValidatorFactory.getValidator(req.paymentMethod());
        var errors = validator.validate(req);
        if (!errors.isEmpty()) {
            throw new IllegalArgumentException("Validation failed: " + String.join(", ", errors));
        }

        // 3. Check reference uniqueness
        if (req.reference() != null && !req.reference().isBlank()
                && payments.existsByReference(req.reference().trim().toUpperCase())) {
            throw new IllegalArgumentException("Reference already used");
        }

        // 4. Validate order
        Order order = orders.findById(req.orderId())
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));

        if (!order.getUserEmail().equals(userEmail)) {
            throw new IllegalArgumentException("Cannot upload payment for another user");
        }

        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Order cannot accept payments in this status");
        }

        // 5. Validate amount matches order total
        if (Math.abs(req.amount() - order.getTotal()) > 0.01) {
            throw new IllegalArgumentException("Payment amount must match order total");
        }

        // 6. Build payment using Builder pattern
        var p = Payment.builder()
                .orderId(order.getId())
                .userEmail(userEmail)
                .status(PaymentStatus.PENDING)
                .paymentMethod(req.paymentMethod())
                .reference(req.reference() != null ? req.reference().trim().toUpperCase() : generateReference())
                .amount(req.amount())
                .receiptUrl(req.receiptUrl())
                .build();

        // 7. Set payment method specific fields using Template Method pattern
        setPaymentMethodFields(p, req);

        payments.save(p);
        return toDto(p);
    }

    private void validateBasicFields(UploadPaymentRequest req) {
        if (req.orderId() == null) {
            throw new IllegalArgumentException("Order ID is required");
        }
        if (req.amount() == null || req.amount() <= 0) {
            throw new IllegalArgumentException("Amount must be greater than zero");
        }
        if (req.amount() > 1000000) {
            throw new IllegalArgumentException("Amount exceeds maximum limit");
        }
        if (req.paymentMethod() == null || req.paymentMethod().isBlank()) {
            throw new IllegalArgumentException("Payment method is required");
        }
    }

    private void setPaymentMethodFields(Payment p, UploadPaymentRequest req) {
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
                // Auto-approve COD
                p.setStatus(PaymentStatus.VERIFIED);
            }
        }
    }

    private String maskCard(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 4) return "****";
        String cleaned = cardNumber.replaceAll("\\s", "");
        return cleaned.substring(cleaned.length() - 4);
    }

    private String maskAccount(String accountNumber) {
        if (accountNumber == null || accountNumber.length() < 4) return "****";
        String cleaned = accountNumber.replaceAll("\\s", "");
        return cleaned.substring(cleaned.length() - 4);
    }

    private String generateReference() {
        return "REF" + System.currentTimeMillis();
    }

    @Transactional
    public PaymentDto approve(Long id, ReviewRequest review) {
        var p = payments.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Payment not found"));

        // Use State pattern to validate transition
        var state = PaymentStateFactory.getState(p.getStatus());
        if (!state.canTransitionTo(PaymentStatus.VERIFIED)) {
            throw new IllegalArgumentException("Cannot approve payment in " + p.getStatus() + " status");
        }

        p.setStatus(PaymentStatus.VERIFIED);
        p.setAdminNote(review == null ? null : review.adminNote());
        payments.save(p);

        // Update order status
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

        // Use State pattern to validate transition
        var state = PaymentStateFactory.getState(p.getStatus());
        if (!state.canTransitionTo(PaymentStatus.REJECTED)) {
            throw new IllegalArgumentException("Cannot reject payment in " + p.getStatus() + " status");
        }

        if (review == null || review.adminNote() == null || review.adminNote().trim().isEmpty()) {
            throw new IllegalArgumentException("Admin note is required for rejection");
        }

        p.setStatus(PaymentStatus.REJECTED);
        p.setAdminNote(review.adminNote());
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
