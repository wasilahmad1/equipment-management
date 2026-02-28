CREATE TABLE equipment_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO equipment_types (name) VALUES
    ('HVAC'),('Electrical'),('Plumbing'),('Mechanical'),('Safety'),('IT Equipment'),('Medical'),('Vehicle');

CREATE TABLE equipment (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type_id INTEGER NOT NULL REFERENCES equipment_types(id),
    status VARCHAR(50) NOT NULL CHECK (status IN ('Active', 'Inactive', 'Under Maintenance')),
    last_cleaned_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE maintenance_logs (
    id SERIAL PRIMARY KEY,
    equipment_id INTEGER NOT NULL REFERENCES equipment(id) ON DELETE CASCADE,
    maintenance_date DATE NOT NULL,
    notes TEXT,
    performed_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_equipment_id ON maintenance_logs(equipment_id);
CREATE INDEX idx_equipment_status ON equipment(status);
