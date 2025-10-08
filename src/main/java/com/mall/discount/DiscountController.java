package com.mall.discount;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.List;

record DiscountDto(Long id, String code, String name, Double percentage, OffsetDateTime startsAt, OffsetDateTime endsAt, Boolean active) {}
record CreateDiscountDto(String code, String name, Double percentage, OffsetDateTime startsAt, OffsetDateTime endsAt, Boolean active) {}
record UpdateDiscountDto(String code, String name, Double percentage, OffsetDateTime startsAt, OffsetDateTime endsAt, Boolean active) {}

@RestController
@RequestMapping("/discounts")
public class DiscountController {
    private final DiscountService service;
    public DiscountController(DiscountService s) { this.service = s; }

    @GetMapping
    public List<DiscountDto> list() {
        return service.findAll().stream().map(DiscountController::toDto).toList();
    }

    @GetMapping("/{id}")
    public DiscountDto get(@PathVariable Long id) { return toDto(service.findById(id)); }

    @PostMapping
    public ResponseEntity<DiscountDto> create(@RequestBody CreateDiscountDto dto) {
        var saved = service.create(dto.code(), dto.name(), dto.percentage(), dto.startsAt(), dto.endsAt(), dto.active());
        return ResponseEntity.ok(toDto(saved));
    }

    @PutMapping("/{id}")
    public DiscountDto update(@PathVariable Long id, @RequestBody UpdateDiscountDto dto) {
        var saved = service.update(id, dto.code(), dto.name(), dto.percentage(), dto.startsAt(), dto.endsAt(), dto.active());
        return toDto(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    private static DiscountDto toDto(Discount d) {
        return new DiscountDto(d.getId(), d.getCode(), d.getName(), d.getPercentage(), d.getStartsAt(), d.getEndsAt(), d.getActive());
    }

    @ExceptionHandler({IllegalArgumentException.class})
    public ResponseEntity<?> badRequest(IllegalArgumentException ex) {
        return ResponseEntity.badRequest().body(java.util.Map.of("message", ex.getMessage()));
    }
}
