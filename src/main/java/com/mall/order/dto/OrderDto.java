package com.mall.order.dto;

import com.mall.order.OrderStatus;

import java.util.List;

public record OrderDto(Long id, String userEmail, OrderStatus status, Double total, String shippingAddress, List<OrderItemDto> items) {}
