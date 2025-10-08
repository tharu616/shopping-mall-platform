package com.mall.cart;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Optional<Cart> findByUserEmail(String userEmail);
    boolean existsByUserEmail(String userEmail);
}
