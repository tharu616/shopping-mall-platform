package com.mall.cart;

import com.mall.cart.dto.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/cart")
public class CartController {
    private final CartService service;
    public CartController(CartService service) { this.service = service; }

    @GetMapping
    public CartDto get(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        return service.getCart(email);
    }

    @PostMapping("/items")
    public ResponseEntity<CartDto> add(@AuthenticationPrincipal UserDetails principal, @RequestBody AddItemRequest req) {
        String email = principal.getUsername();
        return ResponseEntity.ok(service.addItem(email, req));
    }

    @PatchMapping("/items/{itemId}")
    public CartDto update(@AuthenticationPrincipal UserDetails principal, @PathVariable Long itemId, @RequestBody UpdateItemRequest req) {
        String email = principal.getUsername();
        return service.updateItem(email, itemId, req);
    }

    @DeleteMapping("/items/{itemId}")
    public ResponseEntity<CartDto> delete(@AuthenticationPrincipal UserDetails principal, @PathVariable Long itemId) {
        String email = principal.getUsername();
        return ResponseEntity.ok(service.removeItem(email, itemId));
    }

    @DeleteMapping
    public ResponseEntity<CartDto> clear(@AuthenticationPrincipal UserDetails principal) {
        String email = principal.getUsername();
        return ResponseEntity.ok(service.clear(email));
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
