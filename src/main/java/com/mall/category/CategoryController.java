package com.mall.category;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

record CategoryDto(Long id, String name, String slug, Long parentId, Boolean active) {}
record CreateCategoryDto(String name, String slug, Long parentId, Boolean active) {}
record UpdateCategoryDto(String name, String slug, Long parentId, Boolean active) {}

@RestController
@RequestMapping("/categories")
public class CategoryController {
    private final CategoryService service;
    public CategoryController(CategoryService s) { this.service = s; }

    @GetMapping
    public List<CategoryDto> list() {
        return service.findAll().stream().map(CategoryController::toDto).toList();
    }

    @GetMapping("/{id}")
    public CategoryDto get(@PathVariable Long id) { return toDto(service.findById(id)); }

    @PostMapping
    public ResponseEntity<CategoryDto> create(@RequestBody CreateCategoryDto dto) {
        var saved = service.create(dto.name(), dto.slug(), dto.parentId(), dto.active());
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    public CategoryDto update(@PathVariable Long id, @RequestBody UpdateCategoryDto dto) {
        var saved = service.update(id, dto.name(), dto.slug(), dto.parentId(), dto.active());
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static CategoryDto toDto(Category c) {
        return new CategoryDto(c.getId(), c.getName(), c.getSlug(), c.getParentId(), c.getActive());
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
