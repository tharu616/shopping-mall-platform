package com.mall.cart;

import com.mall.cart.dto.*;
import com.mall.product.Product;
import com.mall.product.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CartService {
    private final CartRepository carts;
    private final CartItemRepository items;
    private final ProductRepository products;

    private Cart getOrCreateCart(String userEmail) {
        return carts.findByUserEmail(userEmail).orElseGet(() -> carts.save(Cart.builder().userEmail(userEmail).build()));
    }

    public CartDto getCart(String userEmail) {
        var cart = getOrCreateCart(userEmail);
        var list = items.findByCartId(cart.getId()).stream().map(this::toDto).toList();
        return new CartDto(cart.getId(), cart.getUserEmail(), list, list.stream().mapToDouble(CartItemDto::lineTotal).sum());
    }

    @Transactional
    public CartDto addItem(String userEmail, AddItemRequest req) {
        if (req.productId() == null || req.quantity() == null || req.quantity() < 1)
            throw new IllegalArgumentException("Invalid product or quantity");
        var product = products.findById(req.productId()).orElseThrow(() -> new IllegalArgumentException("Product not found"));
        validateProduct(product);

        var cart = getOrCreateCart(userEmail);
        var existing = items.findByCartIdAndProductId(cart.getId(), product.getId());
        if (existing.isPresent()) {
            var ci = existing.get();
            ci.setQuantity(ci.getQuantity() + req.quantity());
            ci.setLineTotal(ci.getPrice() * ci.getQuantity());
            items.save(ci);
        } else {
            var ci = CartItem.builder()
                    .cart(cart)
                    .productId(product.getId())
                    .sku(product.getSku())
                    .name(product.getName())
                    .price(product.getPrice())
                    .quantity(req.quantity())
                    .lineTotal(product.getPrice() * req.quantity())
                    .build();
            items.save(ci);
        }
        return getCart(userEmail);
    }

    @Transactional
    public CartDto updateItem(String userEmail, Long itemId, UpdateItemRequest req) {
        if (req.quantity() == null || req.quantity() < 1) throw new IllegalArgumentException("Quantity must be at least 1");
        var cart = getOrCreateCart(userEmail);
        var item = items.findById(itemId).orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (!item.getCart().getId().equals(cart.getId())) throw new IllegalArgumentException("Item does not belong to cart");
        item.setQuantity(req.quantity());
        item.setLineTotal(item.getPrice() * item.getQuantity());
        items.save(item);
        return getCart(userEmail);
    }

    @Transactional
    public CartDto removeItem(String userEmail, Long itemId) {
        var cart = getOrCreateCart(userEmail);
        var item = items.findById(itemId).orElseThrow(() -> new IllegalArgumentException("Cart item not found"));
        if (!item.getCart().getId().equals(cart.getId())) throw new IllegalArgumentException("Item does not belong to cart");
        items.delete(item);
        return getCart(userEmail);
    }

    @Transactional
    public CartDto clear(String userEmail) {
        var cart = getOrCreateCart(userEmail);
        items.deleteByCartId(cart.getId());
        return getCart(userEmail);
    }

    private void validateProduct(Product p) {
        if (p.getActive() == null || !p.getActive()) throw new IllegalArgumentException("Product is inactive");
        if (p.getPrice() == null || p.getPrice() < 0) throw new IllegalArgumentException("Product price invalid");
    }

    private CartItemDto toDto(CartItem ci) {
        return new CartItemDto(ci.getId(), ci.getProductId(), ci.getSku(), ci.getName(), ci.getPrice(), ci.getQuantity(), ci.getLineTotal());
    }
}
