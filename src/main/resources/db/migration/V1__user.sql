CREATE TABLE IF NOT EXISTS users (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role VARCHAR(30) NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );


CREATE TABLE products (
                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                          sku VARCHAR(64) NOT NULL UNIQUE,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          price DOUBLE NOT NULL,
                          stock INT NOT NULL,
                          active BOOLEAN NOT NULL DEFAULT TRUE,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS categories (
                                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          name VARCHAR(120) NOT NULL,
    slug VARCHAR(140) NOT NULL UNIQUE,
    parent_id BIGINT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE INDEX IF NOT EXISTS uk_category_slug ON categories(slug);

CREATE TABLE IF NOT EXISTS discounts (
                                         id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                         code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(160) NOT NULL,
    percentage DOUBLE NOT NULL,
    starts_at TIMESTAMP NULL,
    ends_at TIMESTAMP NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE INDEX IF NOT EXISTS uk_discount_code ON discounts(code);

CREATE TABLE IF NOT EXISTS carts (
                                     id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                     user_email VARCHAR(255) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE IF NOT EXISTS cart_items (
                                          id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                          cart_id BIGINT NOT NULL,
                                          product_id BIGINT NOT NULL,
                                          sku VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    line_total DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_cartitem_cart (cart_id),
    INDEX idx_cartitem_product (product_id),
    CONSTRAINT fk_cart FOREIGN KEY (cart_id) REFERENCES carts(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS orders (
                                      id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                      user_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    total DOUBLE NOT NULL,
    shipping_address VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_order_user (user_email)
    );

CREATE TABLE IF NOT EXISTS order_items (
                                           id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                           order_id BIGINT NOT NULL,
                                           product_id BIGINT NOT NULL,
                                           sku VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DOUBLE NOT NULL,
    quantity INT NOT NULL,
    line_total DOUBLE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_orderitem_order (order_id),
    CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
    );

CREATE TABLE IF NOT EXISTS payments (
                                        id BIGINT PRIMARY KEY AUTO_INCREMENT,
                                        order_id BIGINT NOT NULL,
                                        user_email VARCHAR(255) NOT NULL,
    status VARCHAR(20) NOT NULL,
    reference VARCHAR(64) NOT NULL UNIQUE,
    amount DOUBLE NOT NULL,
    receipt_url VARCHAR(500),
    admin_note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_payment_order (order_id),
    INDEX idx_payment_user (user_email)
    );
