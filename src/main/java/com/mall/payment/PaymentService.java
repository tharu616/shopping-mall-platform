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

    public List<PaymentDto> myPayments(String userEmail) {
        return payments.findByUserEmailOrderByCreatedAtDesc(userEmail).stream().map(this::toDto).toList();
    }

    public List<PaymentDto> pending() {
        return payments.findByStatusOrderByCreatedAtDesc(PaymentStatus.PENDING).stream().map(this::toDto).toList();
    }

    public PaymentDto get(Long id) {
        return toDto(payments.findById(id).orElseThrow(() -> new IllegalArgumentException("Payment not found")));
    }

    @Transactional
    public PaymentDto upload(String userEmail, UploadPaymentRequest req) {
        if (req.orderId() == null || req.amount() == null || req.amount() <= 0 || req.reference() == null || req.reference().isBlank())
            throw new IllegalArgumentException("Invalid payment data");
        if (payments.existsByReference(req.reference().trim().toUpperCase()))
            throw new IllegalArgumentException("Reference already used");

        Order order = orders.findById(req.orderId()).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!order.getUserEmail().equals(userEmail))
            throw new IllegalArgumentException("Cannot upload payment for another user");
        if (order.getStatus() == OrderStatus.CANCELLED || order.getStatus() == OrderStatus.DELIVERED)
            throw new IllegalArgumentException("Order cannot accept payments in this status");

        var p = Payment.builder()
                .orderId(order.getId())
                .userEmail(userEmail)
                .status(PaymentStatus.PENDING)
                .reference(req.reference().trim().toUpperCase())
                .amount(req.amount())
                .receiptUrl(req.receiptUrl())
                .build();
        payments.save(p);
        return toDto(p);
    }

    @Transactional
    public PaymentDto approve(Long id, ReviewRequest review) {
        var p = payments.findById(id).orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (p.getStatus() != PaymentStatus.PENDING) throw new IllegalArgumentException("Payment already reviewed");
        p.setStatus(PaymentStatus.VERIFIED);
        p.setAdminNote(review == null ? null : review.adminNote());
        payments.save(p);

        // hook: advance order from PENDING → CONFIRMED when payment verified
        var order = orders.findById(p.getOrderId()).orElse(null);
        if (order != null && order.getStatus() == OrderStatus.PENDING) {
            order.setStatus(OrderStatus.CONFIRMED);
            orders.save(order);
        }

        return toDto(p);
    }

    @Transactional
    public PaymentDto reject(Long id, ReviewRequest review) {
        var p = payments.findById(id).orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        if (p.getStatus() != PaymentStatus.PENDING) throw new IllegalArgumentException("Payment already reviewed");
        p.setStatus(PaymentStatus.REJECTED);
        p.setAdminNote(review == null ? null : review.adminNote());
        payments.save(p);
        return toDto(p);
    }

    private PaymentDto toDto(Payment p) {
        return new PaymentDto(p.getId(), p.getOrderId(), p.getUserEmail(), p.getStatus(), p.getReference(), p.getAmount(), p.getReceiptUrl(), p.getAdminNote());
    }
}
