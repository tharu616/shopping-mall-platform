package com.mall.cart.dto;

public record CartItemDto(Long id, Long productId, String sku, String name, Double price, Integer quantity, Double lineTotal) {}
