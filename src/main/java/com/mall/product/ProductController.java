package com.mall.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

// ✨ Updated DTO with imageUrl
record ProductDto(Long id, String sku, String name, String description, Double price, Integer stock, Boolean active, String imageUrl) {}

@RestController
@RequestMapping("/products")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService s) { this.service = s; }

    @GetMapping
    public List<ProductDto> list() {
        return service.findAll().stream().map(ProductController::toDto).toList();
    }

    @GetMapping("/{id}")
    public ProductDto get(@PathVariable Long id) {
        return toDto(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<ProductDto> create(@RequestBody ProductDto dto) {
        var saved = service.create(fromDto(dto));
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    public ProductDto update(@PathVariable Long id, @RequestBody ProductDto dto) {
        return toDto(service.update(id, fromDto(dto)));
    }

    // ✨ NEW: Upload product image endpoint
    @PostMapping("/{id}/upload-image")
    public ResponseEntity<ProductDto> uploadImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile file) {
        try {
            Product updated = service.uploadProductImage(id, file);
            return ResponseEntity.ok(toDto(updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(),
                p.getSku(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(),
                p.getActive(),
                p.getImageUrl()  // ✨ NEW: Include imageUrl
        );
    }

    private static Product fromDto(ProductDto d) {
        return Product.builder()
                .id(d.id())
                .sku(d.sku())
                .name(d.name())
                .description(d.description())
                .price(d.price())
                .stock(d.stock())
                .active(d.active() == null ? true : d.active())
                .imageUrl(d.imageUrl())  // ✨ NEW: Include imageUrl
                .build();
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<java.util.Map<String, String>> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
