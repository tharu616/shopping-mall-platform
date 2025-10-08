package com.mall.order;

import com.mall.cart.CartRepository;
import com.mall.cart.CartItemRepository;
import com.mall.order.dto.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {
    private final OrderRepository orders;
    private final OrderItemRepository orderItems;
    private final CartRepository carts;
    private final CartItemRepository cartItems;

    public List<OrderDto> listMy(String userEmail) {
        return orders.findByUserEmailOrderByCreatedAtDesc(userEmail).stream().map(this::toDto).toList();
    }

    public OrderDto getOne(Long id, String userEmail) {
        var o = orders.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        if (!o.getUserEmail().equals(userEmail)) throw new IllegalArgumentException("Access denied");
        return toDto(o);
    }

    public List<OrderDto> listByStatus(OrderStatus status) {
        return (status == null ? orders.findAll() : orders.findByStatusOrderByCreatedAtDesc(status)).stream().map(this::toDto).toList();
    }

    @Transactional
    public OrderDto checkout(String userEmail, CheckoutRequest req) {
        var cart = carts.findByUserEmail(userEmail).orElseThrow(() -> new IllegalArgumentException("Cart not found"));
        var items = cartItems.findByCartId(cart.getId());
        if (items.isEmpty()) throw new IllegalArgumentException("Cart is empty");

        double total = items.stream().mapToDouble(ci -> ci.getLineTotal()).sum();

        var order = orders.save(Order.builder()
                .userEmail(userEmail)
                .status(OrderStatus.PENDING)
                .total(total)
                .shippingAddress(req.shippingAddress())
                .build());

        for (var ci : items) {
            orderItems.save(OrderItem.builder()
                    .order(order)
                    .productId(ci.getProductId())
                    .sku(ci.getSku())
                    .name(ci.getName())
                    .price(ci.getPrice())
                    .quantity(ci.getQuantity())
                    .lineTotal(ci.getLineTotal())
                    .build());
        }

        // clear cart after checkout
        cartItems.deleteByCartId(cart.getId());

        return toDto(order);
    }

    @Transactional
    public OrderDto updateStatus(Long id, UpdateStatusRequest req) {
        var o = orders.findById(id).orElseThrow(() -> new IllegalArgumentException("Order not found"));
        var next = req.status();
        if (!isValidTransition(o.getStatus(), next))
            throw new IllegalArgumentException("Invalid status transition from " + o.getStatus() + " to " + next);
        o.setStatus(next);
        orders.save(o);
        return toDto(o);
    }

    private boolean isValidTransition(OrderStatus from, OrderStatus to) {
        if (from == to) return true;
        return switch (from) {
            case PENDING -> EnumSet.of(OrderStatus.CONFIRMED, OrderStatus.CANCELLED).contains(to);
            case CONFIRMED -> EnumSet.of(OrderStatus.PROCESSING, OrderStatus.CANCELLED).contains(to);
            case PROCESSING -> EnumSet.of(OrderStatus.SHIPPED).contains(to);
            case SHIPPED -> EnumSet.of(OrderStatus.DELIVERED).contains(to);
            case DELIVERED, CANCELLED -> false;
        };
    }

    private OrderDto toDto(Order o) {
        var its = orderItems.findByOrderId(o.getId()).stream()
                .map(oi -> new OrderItemDto(oi.getId(), oi.getProductId(), oi.getSku(), oi.getName(), oi.getPrice(), oi.getQuantity(), oi.getLineTotal()))
                .toList();
        return new OrderDto(o.getId(), o.getUserEmail(), o.getStatus(), o.getTotal(), o.getShippingAddress(), its);
    }
}
