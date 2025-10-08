package com.mall.discount;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(name = "discounts", indexes = {
        @Index(name = "uk_discount_code", columnList = "code", unique = true)
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Discount extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 64, unique = true)
    private String code;

    @Column(nullable = false, length = 160)
    private String name;

    @Column(nullable = false)
    private Double percentage; // 0 < percentage ≤ 100

    private OffsetDateTime startsAt;
    private OffsetDateTime endsAt;

    @Column(nullable = false)
    private Boolean active = true;
}
