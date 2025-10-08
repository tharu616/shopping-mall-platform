package com.mall.cart;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "carts", indexes = @Index(name = "idx_cart_user", columnList = "userEmail", unique = true))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Cart extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255, unique = true)
    private String userEmail; // from JWT subject
}
