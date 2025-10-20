package com.mall.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {
    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetLink = "http://localhost:5173/reset-password/" + resetToken;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Password Reset Request");
        message.setText("Click the link below to reset your password:\n\n" + resetLink +
                "\n\nThis link will expire in 1 hour.");

        mailSender.send(message);
    }
}
