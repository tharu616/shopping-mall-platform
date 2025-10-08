package com.mall.payment;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    boolean existsByReference(String reference);
    List<Payment> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    List<Payment> findByStatusOrderByCreatedAtDesc(PaymentStatus status);
}
