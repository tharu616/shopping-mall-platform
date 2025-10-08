package com.mall.common;

import jakarta.persistence.*;
import lombok.Getter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;

@MappedSuperclass
@Getter
public abstract class BaseEntity {
    @CreationTimestamp @Column(updatable = false)
    protected Instant createdAt;
    @UpdateTimestamp
    protected Instant updatedAt;
}
