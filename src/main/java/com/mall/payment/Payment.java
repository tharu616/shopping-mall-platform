package com.mall.payment;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "payments", indexes = {
        @Index(name = "idx_payment_order", columnList = "orderId"),
        @Index(name = "idx_payment_user", columnList = "userEmail"),
        @Index(name = "uk_payment_reference", columnList = "reference", unique = true)
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Payment extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long orderId;

    @Column(nullable = false, length = 255)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PaymentStatus status;

    @Column(length = 50)
    private String paymentMethod; // CARD, BANK_TRANSFER, PAYPAL, CASH_ON_DELIVERY

    @Column(nullable = false, length = 64, unique = true)
    private String reference;

    @Column(nullable = false)
    private Double amount;

    @Column(length = 500)
    private String receiptUrl;

    // Card fields
    @Column(length = 20)
    private String cardLast4; // Store only last 4 digits for security

    @Column(length = 100)
    private String cardHolderName;

    // Bank fields
    @Column(length = 100)
    private String bankName;

    @Column(length = 50)
    private String accountLast4; // Last 4 digits of account

    @Column(length = 100)
    private String accountHolderName;

    @Column(length = 20)
    private String branchCode;

    @Column(length = 20)
    private String transferDate;

    // PayPal fields
    @Column(length = 255)
    private String paypalEmail;

    @Column(length = 100)
    private String paypalTransactionId;

    @Column(length = 255)
    private String adminNote;
}
