package com.mall.category;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {
    private final CategoryRepository repo;

    public List<Category> findAll() { return repo.findAll(); }
    public Category findById(Long id) {
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Category not found"));
    }

    private String slugify(String input) {
        String s = Normalizer.normalize(input.trim().toLowerCase(), Normalizer.Form.NFD)
                .replaceAll("[\\p{InCombiningDiacriticalMarks}]", "");
        s = s.replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        return s.isBlank() ? "n-a" : s;
    }

    @Transactional
    public Category create(String name, String slug, Long parentId, Boolean active) {
        String finalSlug = (slug == null || slug.isBlank()) ? slugify(name) : slugify(slug);
        if (repo.existsBySlug(finalSlug)) throw new IllegalArgumentException("Slug already exists");
        if (parentId != null && !repo.existsById(parentId)) throw new IllegalArgumentException("Parent category not found");
        var c = Category.builder()
                .name(name.trim())
                .slug(finalSlug)
                .parentId(parentId)
                .active(active == null ? true : active)
                .build();
        return repo.save(c);
    }

    @Transactional
    public Category update(Long id, String name, String slug, Long parentId, Boolean active) {
        var c = findById(id);
        String finalSlug = (slug == null || slug.isBlank()) ? slugify(name != null ? name : c.getName()) : slugify(slug);
        if (!finalSlug.equals(c.getSlug()) && repo.existsBySlug(finalSlug)) throw new IllegalArgumentException("Slug already exists");
        if (parentId != null && !repo.existsById(parentId)) throw new IllegalArgumentException("Parent category not found");
        c.setName(name != null ? name.trim() : c.getName());
        c.setSlug(finalSlug);
        c.setParentId(parentId);
        c.setActive(active == null ? c.getActive() : active);
        return repo.save(c);
    }

    @Transactional
    public void delete(Long id) { repo.deleteById(id); }
}
