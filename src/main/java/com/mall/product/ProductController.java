package com.mall.product;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record ProductDto(Long id, String sku, String name, String description, Double price, Integer stock, Boolean active) {}

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

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static ProductDto toDto(Product p) {
        return new ProductDto(p.getId(), p.getSku(), p.getName(), p.getDescription(), p.getPrice(), p.getStock(), p.getActive());
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
                .build();
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
