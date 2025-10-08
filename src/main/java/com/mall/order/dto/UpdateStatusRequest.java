package com.mall.order.dto;

import com.mall.order.OrderStatus;

public record UpdateStatusRequest(OrderStatus status) {}
