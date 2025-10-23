package com.mall.product;

import com.mall.common.BaseEntity;

import com.mall.review.Review;
import jakarta.persistence.*;

import lombok.*;

import java.util.List;

@Entity

@Table(name = "products")

@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder

public class Product extends BaseEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Long id;

    @Column(nullable=false, unique=true, length=64)

    private String sku;

    @Column(nullable=false, length=255)

    private String name;

    @Column(columnDefinition="TEXT")

    private String description;

    @Column(nullable=false)

    private Double price;

    @Column(nullable=false)

    private Integer stock;

    @Column(nullable=false)

    private Boolean active = true;

    // ✨ NEW: Image URL field
    @Column(length=500)
    private String imageUrl;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL)
    private List<Review> reviews;

}
