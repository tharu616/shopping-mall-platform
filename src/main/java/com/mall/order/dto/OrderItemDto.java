package com.mall.order.dto;

public record OrderItemDto(Long id, Long productId, String sku, String name, Double price, Integer quantity, Double lineTotal) {}
