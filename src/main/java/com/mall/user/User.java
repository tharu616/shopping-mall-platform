package com.mall.user;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
    private String fullName;

    // Profile Picture
    private String profilePictureUrl;

    // Password Reset
    private String resetToken;
    private LocalDateTime resetTokenExpiry;

    @Enumerated(EnumType.STRING)
    private Role role;

    private boolean active;
}
