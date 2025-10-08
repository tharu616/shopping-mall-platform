INSERT INTO users(email, password, full_name, role, active)
VALUES
    ('admin@mall.local', '$2a$10$QOe49Qv0O6i2zVb6v0wJju9uE7m0V9q1mE8VQWqzvB3w8Q8n5h3l2', 'Admin', 'ADMIN', true)
    ON DUPLICATE KEY UPDATE email=email;
