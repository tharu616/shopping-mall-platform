package com.mall.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload.directory:uploads}")
    private String uploadDir;

    public String uploadFile(MultipartFile file, String subfolder) {
        try {
            // Create upload directory if it doesn't exist
            Path uploadPath = Paths.get(uploadDir, subfolder);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String newFilename = UUID.randomUUID().toString() + extension;

            // Save file
            Path filePath = uploadPath.resolve(newFilename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // Return relative URL path
            return "/" + subfolder + "/" + newFilename;

        } catch (IOException e) {
            throw new RuntimeException("Failed to upload file: " + e.getMessage());
        }
    }

    public void deleteFile(String fileUrl) {
        try {
            Path filePath = Paths.get(uploadDir + fileUrl);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            // Log error but don't throw exception
            System.err.println("Failed to delete file: " + e.getMessage());
        }
    }
}
