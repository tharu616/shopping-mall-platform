package com.mall.auth;

import com.mall.config.JwtService;
import com.mall.user.*;
import com.mall.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;
    private final EmailService emailService; // ADD THIS

    // EXISTING METHOD - Keep as is
    public String register(String email, String fullName, String password, Role role) {
        if (users.existsByEmail(email)) throw new IllegalArgumentException("Email already exists");
        User u = User.builder()
                .email(email).fullName(fullName)
                .password(encoder.encode(password))
                .role(role).active(true).build();
        users.save(u);
        return jwt.generate(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
    }

    // EXISTING METHOD - Keep as is
    public String login(User u) {
        return jwt.generate(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
    }

    // NEW: Send Password Reset Token
    public void sendPasswordResetToken(String email) {
        User user = users.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found with email: " + email));

        // Generate reset token
        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1)); // 1 hour expiry
        users.save(user);

        // Send email
        emailService.sendPasswordResetEmail(email, resetToken);
    }

    // NEW: Reset Password
    public void resetPassword(String token, String newPassword) {
        User user = users.findAll().stream()
                .filter(u -> token.equals(u.getResetToken()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid reset token"));

        // Check if token expired
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Reset token has expired");
        }

        // Update password
        user.setPassword(encoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        users.save(user);
    }

    // NEW: Validate Reset Token
    public boolean isResetTokenValid(String token) {
        return users.findAll().stream()
                .anyMatch(u -> token.equals(u.getResetToken()) &&
                        u.getResetTokenExpiry() != null &&
                        u.getResetTokenExpiry().isAfter(LocalDateTime.now()));
    }
}
