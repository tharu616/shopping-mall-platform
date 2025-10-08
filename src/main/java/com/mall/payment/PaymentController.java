package com.mall.payment;

import com.mall.payment.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService service;
    public PaymentController(PaymentService s) { this.service = s; }

    // Customer
    @PostMapping("/upload")
    public ResponseEntity<PaymentDto> upload(@AuthenticationPrincipal UserDetails principal, @RequestBody UploadPaymentRequest req) {
        var email = principal.getUsername();
        return ResponseEntity.ok(service.upload(email, req));
    }

    @GetMapping("/mine")
    public List<PaymentDto> mine(@AuthenticationPrincipal UserDetails principal) {
        var email = principal.getUsername();
        return service.myPayments(email);
    }

    // Admin
    @GetMapping("/pending")
    public List<PaymentDto> pending() {
        return service.pending();
    }

    @GetMapping("/{id}")
    public PaymentDto get(@PathVariable Long id) {
        return service.get(id);
    }

    @PatchMapping("/{id}/approve")
    public PaymentDto approve(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        return service.approve(id, req);
    }

    @PatchMapping("/{id}/reject")
    public PaymentDto reject(@PathVariable Long id, @RequestBody(required = false) ReviewRequest req) {
        return service.reject(id, req);
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
