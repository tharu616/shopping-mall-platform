package com.mall.cart.dto;

import java.util.List;

public record CartDto(Long id, String userEmail, List<CartItemDto> items, Double total) {}
