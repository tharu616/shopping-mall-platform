package com.mall.auth;

public record ResetPasswordRequest(String token, String newPassword) {}
