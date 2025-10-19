package com.mall.review;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "reviews")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Review extends BaseEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private String userEmail;

    @Column(nullable = false)
    private Integer rating; // 1-5 stars

    @Column(length = 1000)
    private String comment;

    @Column(nullable = false)
    private Boolean approved = false;

    private String adminNote;
}
