package com.mall.config;

import com.mall.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;

import java.util.List;

@Configuration
@RequiredArgsConstructor
public class UserDetailsConfig {
    private final UserRepository users;

    @Bean
    public UserDetailsService userDetailsService() {
        return username -> users.findByEmail(username)
                .map(u -> User.withUsername(u.getEmail())
                        .password(u.getPassword())
                        .authorities(List.of(new SimpleGrantedAuthority("ROLE_" + u.getRole().name())))
                        .disabled(!u.isActive())
                        .build())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}
