package com.mall.payment;

import com.mall.payment.dto.*;
import com.mall.user.Role;
import com.mall.user.User;
import com.mall.user.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/payments")
public class PaymentController {
    private final PaymentService service;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public PaymentController(PaymentService s, PaymentRepository pr, UserRepository ur) {
        this.service = s;
        this.paymentRepository = pr;
        this.userRepository = ur;
    }

    // Customer
    @PostMapping("/upload")
    public ResponseEntity<PaymentDto> upload(@AuthenticationPrincipal UserDetails principal, @RequestBody UploadPaymentRequest req) {
        var email = principal.getUsername();
        return ResponseEntity.ok(service.upload(email, req));
    }

    @GetMapping("/mine")
    public List<PaymentListDto> mine(@AuthenticationPrincipal UserDetails principal) {
        var email = principal.getUsername();
        return service.myPayments(email);
    }

    // Admin
    @GetMapping("/pending")
    public List<PaymentListDto> pending() {
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

    // ✅ FIXED: Payment History endpoint
    @GetMapping("/history")
    public ResponseEntity<?> getPaymentHistory(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) String userEmail
    ) {
        try {
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userRepository.findByEmail(currentUserEmail)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<Payment> payments;

            // Admin can see all payments, Vendors can see only their payments
            if (currentUser.getRole() == Role.ADMIN) {
                payments = paymentRepository.findAll();
            } else if (currentUser.getRole() == Role.VENDOR) {
                payments = paymentRepository.findByUserEmail(currentUserEmail);
            } else {
                return ResponseEntity.status(403).body("Access denied");
            }

            // Apply filters
            if (status != null && !status.isEmpty()) {
                payments = payments.stream()
                        .filter(p -> p.getStatus().name().equals(status))
                        .collect(Collectors.toList());
            }

            if (startDate != null && endDate != null) {
                // Add date filtering logic if you have createdAt field in Payment entity
            }

            if (userEmail != null && !userEmail.isEmpty() && currentUser.getRole() == Role.ADMIN) {
                payments = payments.stream()
                        .filter(p -> p.getUserEmail().contains(userEmail))
                        .collect(Collectors.toList());
            }

            // ✅ FIXED: Use PaymentHistoryDto with correct parameter order
            List<PaymentHistoryDto> paymentDtos = payments.stream()
                    .map(p -> new PaymentHistoryDto(
                            p.getId(),
                            p.getOrderId(),
                            p.getUserEmail(),
                            p.getAmount(),
                            p.getStatus().name(),
                            p.getReference()
                    ))
                    .collect(Collectors.toList());

            return ResponseEntity.ok(paymentDtos);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to fetch payment history: " + e.getMessage());
        }
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
