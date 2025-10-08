package com.mall.auth;

import com.mall.config.JwtService;
import com.mall.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthenticationService {
    private final UserRepository users;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public String register(String email, String fullName, String password, Role role) {
        if (users.existsByEmail(email)) throw new IllegalArgumentException("Email already exists");
        User u = User.builder()
                .email(email).fullName(fullName)
                .password(encoder.encode(password))
                .role(role).active(true).build();
        users.save(u);
        return jwt.generate(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
    }

    public String login(User u) {
        return jwt.generate(u.getEmail(), Map.of("role", u.getRole().name(), "uid", u.getId()));
    }
}
