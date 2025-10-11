package com.mall.review;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews", indexes = {
        @Index(name = "idx_review_product", columnList = "productId"),
        @Index(name = "idx_review_user", columnList = "userEmail"),
        @Index(name = "idx_review_status", columnList = "status")
})
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false, length = 255)
    private String userEmail;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ReviewStatus status;

    // 1..5
    @Column(nullable = false)
    private Integer rating;

    @Column(length = 120)
    private String title;

    @Column(length = 2000)
    private String comment;
}
