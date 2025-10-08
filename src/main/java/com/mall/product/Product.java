package com.mall.product;

import com.mall.common.BaseEntity;
import jakarta.persistence.*;
import lombok.*;

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
}
