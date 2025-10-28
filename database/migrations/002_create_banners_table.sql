CREATE TABLE IF NOT EXISTS banners (
    id UUID PRIMARY KEY,
    banner_name VARCHAR(255) NOT NULL UNIQUE,
    banner_image TEXT NOT NULL,
    description VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);