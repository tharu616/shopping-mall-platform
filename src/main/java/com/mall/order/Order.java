package com.mall.order;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "orders", indexes = @Index(name = "idx_order_user", columnList = "userEmail"))
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Order extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private OrderStatus status;

    @Column(nullable = false)
    private Double total;

    @Column(length = 500)
    private String shippingAddress;
}
