package com.mall.auth;

import com.mall.user.Role;
import com.mall.user.UserRepository;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

record LoginRequest(@Email String email, @NotBlank String password) {}
record RegisterRequest(@Email String email, @NotBlank String password, @NotBlank String fullName, Role role) {}
record AuthResponse(String token) {}

@RestController
@RequestMapping("/auth")
@Validated
public class AuthController {
    private final AuthenticationManager authManager;
    private final AuthenticationService authService;
    private final UserRepository users;
    private final UserDetailsService uds;

    public AuthController(AuthenticationManager am, AuthenticationService as, UserRepository ur, UserDetailsService uds) {
        this.authManager = am; this.authService = as; this.users = ur; this.uds = uds;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        var role = req.role() == null ? Role.CUSTOMER : req.role();
        String token = authService.register(req.email(), req.fullName(), req.password(), role);
        return ResponseEntity.ok(new AuthResponse(token));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        authManager.authenticate(new UsernamePasswordAuthenticationToken(req.email(), req.password()));
        var user = users.findByEmail(req.email()).orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));
        return ResponseEntity.ok(new AuthResponse(authService.login(user)));
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
