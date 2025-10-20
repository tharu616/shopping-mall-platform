package com.mall.user;

import com.mall.service.FileStorageService;
import jakarta.validation.constraints.NotBlank;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

record UserDto(Long id, String email, String fullName, String profilePictureUrl, Role role, boolean active) {}
record UpdateProfileDto(@NotBlank String fullName) {}

@RestController
@RequestMapping("/users")
public class UserController {
    private final UserRepository users;
    private final FileStorageService fileStorageService;

    public UserController(UserRepository users, FileStorageService fileStorageService) {
        this.users = users;
        this.fileStorageService = fileStorageService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(@AuthenticationPrincipal UserDetails principal) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();
        return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getFullName(),
                u.getProfilePictureUrl(), u.getRole(), u.isActive()));
    }

    @PutMapping("/me")
    public ResponseEntity<UserDto> update(@AuthenticationPrincipal UserDetails principal,
                                          @RequestBody UpdateProfileDto dto) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();
        u.setFullName(dto.fullName());
        users.save(u);
        return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getFullName(),
                u.getProfilePictureUrl(), u.getRole(), u.isActive()));
    }

    // NEW: Upload Profile Picture
    @PostMapping("/me/upload-profile-picture")
    public ResponseEntity<UserDto> uploadProfilePicture(
            @AuthenticationPrincipal UserDetails principal,
            @RequestParam("file") MultipartFile file) {

        var u = users.findByEmail(principal.getUsername()).orElseThrow();

        // Delete old profile picture if exists
        if (u.getProfilePictureUrl() != null) {
            fileStorageService.deleteFile(u.getProfilePictureUrl());
        }

        // Upload new picture
        String fileUrl = fileStorageService.uploadFile(file, "profile-pictures");
        u.setProfilePictureUrl(fileUrl);
        users.save(u);

        return ResponseEntity.ok(new UserDto(u.getId(), u.getEmail(), u.getFullName(),
                u.getProfilePictureUrl(), u.getRole(), u.isActive()));
    }

    // NEW: Delete Profile Picture
    @DeleteMapping("/me/profile-picture")
    public ResponseEntity<Void> deleteProfilePicture(@AuthenticationPrincipal UserDetails principal) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();

        if (u.getProfilePictureUrl() != null) {
            fileStorageService.deleteFile(u.getProfilePictureUrl());
            u.setProfilePictureUrl(null);
            users.save(u);
        }

        return ResponseEntity.noContent().build();
    }

    // UPDATED: Delete Account (Hard Delete)
    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(@AuthenticationPrincipal UserDetails principal) {
        var u = users.findByEmail(principal.getUsername()).orElseThrow();

        // Delete profile picture if exists
        if (u.getProfilePictureUrl() != null) {
            fileStorageService.deleteFile(u.getProfilePictureUrl());
        }

        // Hard delete the user (cascading will handle related data)
        users.delete(u);

        return ResponseEntity.noContent().build();
    }

    @ExceptionHandler({IllegalArgumentException.class, RuntimeException.class})
    public ResponseEntity<java.util.Map<String, String>> handleBadRequest(Exception ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
