package com.mall.order;

import com.mall.order.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/orders")
public class OrderController {
    private final OrderService service;

    public OrderController(OrderService s) {
        this.service = s;
    }

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

        // Check if user is admin/vendor
        boolean isAdmin = principal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || auth.getAuthority().equals("ROLE_VENDOR"));

        if (isAdmin) {
            // Admin can view any order
            return service.listByStatus(null).stream()
                    .filter(o -> o.id().equals(id))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        } else {
            // Customer can only view their own order
            return service.getOne(id, email);
        }
    }

    // Admin/Vendor endpoints
    @GetMapping
    public List<OrderDto> listByStatus(@AuthenticationPrincipal UserDetails principal, @RequestParam(required = false) OrderStatus status) {
        // Check if user is admin or vendor
        boolean isAdminOrVendor = principal.getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || auth.getAuthority().equals("ROLE_VENDOR"));

        if (!isAdminOrVendor) {
            // If customer, return only their orders
            return service.listMy(principal.getUsername());
        }

        // Admin/Vendor can see all orders
        return service.listByStatus(status);
    }

    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(@PathVariable Long id, @RequestBody UpdateStatusRequest req) {
        return service.updateStatus(id, req);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
