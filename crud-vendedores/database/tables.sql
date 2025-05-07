-- Tabla para tipos de café
CREATE TABLE IF NOT EXISTS tipo_cafe (
    id_cafe INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Modificar la tabla vendedor para incluir la referencia al tipo de café
ALTER TABLE vendedor
ADD COLUMN IF NOT EXISTS id_cafe INT,
ADD FOREIGN KEY (id_cafe) REFERENCES tipo_cafe(id_cafe);

-- Insertar algunos tipos de café de ejemplo
INSERT INTO tipo_cafe (nombre, descripcion, precio) VALUES
('Espresso', 'Café concentrado preparado al forzar agua caliente a través de café molido', 5.00),
('Cappuccino', 'Espresso con leche espumada y cacao en polvo', 7.00),
('Latte', 'Espresso con leche caliente y una pequeña capa de espuma', 6.50),
('Moka', 'Espresso con chocolate y leche', 7.50),
('Americano', 'Espresso diluido con agua caliente', 4.50); 