package com.mall.discount;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DiscountService {
    private final DiscountRepository repo;

    public List<Discount> findAll() { return repo.findAll(); }
    public Discount findById(Long id) { return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Discount not found")); }

    private void validate(String code, Double percentage, OffsetDateTime startsAt, OffsetDateTime endsAt) {
        if (percentage == null || percentage <= 0 || percentage > 100)
            throw new IllegalArgumentException("Percentage must be between 0 and 100");
        if (startsAt != null && endsAt != null && !endsAt.isAfter(startsAt))
            throw new IllegalArgumentException("End date must be after start date");
        if (code == null || code.isBlank())
            throw new IllegalArgumentException("Code is required");
    }

    @Transactional
    public Discount create(String code, String name, Double percentage, OffsetDateTime startsAt, OffsetDateTime endsAt, Boolean active) {
        validate(code, percentage, startsAt, endsAt);
        if (repo.existsByCode(code.trim().toUpperCase())) throw new IllegalArgumentException("Code already exists");
        var d = Discount.builder()
                .code(code.trim().toUpperCase())
                .name(name == null ? code.trim().toUpperCase() : name.trim())
                .percentage(percentage)
                .startsAt(startsAt)
                .endsAt(endsAt)
                .active(active == null ? true : active)
                .build();
        return repo.save(d);
    }

    @Transactional
    public Discount update(Long id, String code, String name, Double percentage, OffsetDateTime startsAt, OffsetDateTime endsAt, Boolean active) {
        var d = findById(id);
        validate(code != null ? code : d.getCode(), percentage != null ? percentage : d.getPercentage(), startsAt, endsAt);
        String newCode = code == null ? d.getCode() : code.trim().toUpperCase();
        if (!newCode.equals(d.getCode()) && repo.existsByCode(newCode)) throw new IllegalArgumentException("Code already exists");

        d.setCode(newCode);
        d.setName(name != null ? name.trim() : d.getName());
        d.setPercentage(percentage != null ? percentage : d.getPercentage());
        d.setStartsAt(startsAt);
        d.setEndsAt(endsAt);
        d.setActive(active == null ? d.getActive() : active);
        return repo.save(d);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}
