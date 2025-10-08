package com.mall.order;

import com.mall.order.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService service;
    public OrderController(OrderService s) { this.service = s; }

    // Customer endpoints
    @PostMapping
    public ResponseEntity<OrderDto> checkout(@AuthenticationPrincipal UserDetails principal, @RequestBody CheckoutRequest req) {
        var email = principal.getUsername();
        return ResponseEntity.ok(service.checkout(email, req));
    }

    @GetMapping("/me")
    public List<OrderDto> myOrders(@AuthenticationPrincipal UserDetails principal) {
        var email = principal.getUsername();
        return service.listMy(email);
    }

    @GetMapping("/{id}")
    public OrderDto getMine(@AuthenticationPrincipal UserDetails principal, @PathVariable Long id) {
        var email = principal.getUsername();
        return service.getOne(id, email);
    }

    // Admin endpoints
    @GetMapping
    public List<OrderDto> listByStatus(@RequestParam(required = false) OrderStatus status) {
        return service.listByStatus(status);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest req) {
        return service.updateStatus(id, req);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
