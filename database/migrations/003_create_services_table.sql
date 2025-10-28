CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_code VARCHAR(50) NOT NULL UNIQUE,
    service_name VARCHAR(100) NOT NULL,
    service_icon TEXT,
    service_tariff INTEGER NOT NULL CHECK (service_tariff >= 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
