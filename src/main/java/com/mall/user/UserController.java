package com.mall.user;

import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

record UserDto(Long id, String email, String fullName, Role role, boolean active) {}
record UpdateProfileDto(@NotBlank String fullName) {}

@RestController @RequestMapping("/users")
public class UserController {
    private final UserRepository users;

    public UserController(UserRepository users) { this.users = users; }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal UserDetails principal) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.isActive()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> update(@AuthenticationPrincipal UserDetails principal, @RequestBody UpdateProfileDto dto) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();
        u.setFullName(dto.fullName());
        users.save(u);
        return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.isActive()));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deactivate(@AuthenticationPrincipal UserDetails principal) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();
        u.setActive(false);
        users.save(u);
        return ResponseEntity.noContent().build();
    }

    // UserController.java (keep your existing endpoints)
    @ExceptionHandler({IllegalArgumentException.class, RuntimeException.class})
    public ResponseEntity<?> handleBadRequest(Exception ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }

}
