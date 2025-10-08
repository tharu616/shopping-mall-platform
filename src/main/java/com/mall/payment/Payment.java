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

    @Column(nullable = false, length = 64, unique = true)
    private String reference;

    @Column(nullable = false)
    private Double amount;

    // For simplicity store path/URL; in real apps use object storage
    @Column(length = 500)
    private String receiptUrl;

    @Column(length = 255)
    private String adminNote;
}
