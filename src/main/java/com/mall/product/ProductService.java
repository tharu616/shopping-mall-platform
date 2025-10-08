package com.mall.product;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {
    private final ProductRepository repo;

    public List<Product> findAll() { return repo.findAll(); }
    public Product findById(Long id) { return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Product not found")); }

    @Transactional
    public Product create(Product p) {
        if (repo.existsBySku(p.getSku())) throw new IllegalArgumentException("SKU already exists");
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
        return repo.save(p);
    }

    @Transactional
    public void delete(Long id) {
        repo.deleteById(id);
    }
}
