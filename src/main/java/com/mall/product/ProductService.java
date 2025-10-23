package com.mall.product;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository repo;

    @Value("${file.upload.directory:uploads}")
    private String uploadDirectory;

    public List<Product> findAll() { return repo.findAll(); }

    public Product findById(Long id) {
        return repo.findById(id).orElseThrow(() ->
                new IllegalArgumentException("Product not found"));
    }

    @Transactional
    public Product create(Product p) {
        if (repo.existsBySku(p.getSku()))
            throw new IllegalArgumentException("SKU already exists");
        return repo.save(p);
    }

    @Transactional
    public Product update(Long id, Product changes) {
        var p = findById(id);
        if (!p.getSku().equals(changes.getSku()) && repo.existsBySku(changes.getSku()))
            throw new IllegalArgumentException("SKU already exists");

        p.setSku(changes.getSku());
        p.setName(changes.getName());
        p.setDescription(changes.getDescription());
        p.setPrice(changes.getPrice());
        p.setStock(changes.getStock());
        p.setActive(changes.getActive());

        // ✨ Update imageUrl if provided
        if (changes.getImageUrl() != null) {
            p.setImageUrl(changes.getImageUrl());
        }

        return repo.save(p);
    }

    // ✨ NEW: Upload product image
    @Transactional
    public Product uploadProductImage(Long productId, MultipartFile file) throws IOException {
        Product product = findById(productId);

        // Validate file
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Please select a file to upload");
        }

        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image files are allowed");
        }

        // Create uploads directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDirectory);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String newFilename = "product_" + productId + "_" + UUID.randomUUID() + fileExtension;

        // Save file
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        // Update product with image URL
        String imageUrl = "/" + uploadDirectory + "/" + newFilename;
        product.setImageUrl(imageUrl);

        return repo.save(product);
    }

    @Transactional
    public void delete(Long id) {
        Product product = findById(id);

        // ✨ Delete image file if exists
        if (product.getImageUrl() != null) {
            try {
                Path imagePath = Paths.get(uploadDirectory).resolve(
                        product.getImageUrl().substring(product.getImageUrl().lastIndexOf("/") + 1)
                );
                Files.deleteIfExists(imagePath);
            } catch (IOException e) {
                // Log error but continue with deletion
            }
        }

        repo.deleteById(id);
    }
}
