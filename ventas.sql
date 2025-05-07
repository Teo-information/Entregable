   CREATE TABLE Distrito (
       id_distrito INT PRIMARY KEY AUTO_INCREMENT,
       nombre VARCHAR(50) NOT NULL
   );
      CREATE TABLE Vendedor (
       id_ven INT PRIMARY KEY AUTO_INCREMENT,
       nom_ven VARCHAR(25) NOT NULL,
       ape_ven VARCHAR(25) NOT NULL,
       cel_ven CHAR(9) NOT NULL,
       id_distrito INT,
       FOREIGN KEY (id_distrito) REFERENCES Distrito(id_distrito) ON DELETE SET NULL
   );
   -- Primero crear la base de datos si no existe
USE railway;

-- Eliminar procedimientos almacenados si existen
DROP PROCEDURE IF EXISTS sp_ingven;
DROP PROCEDURE IF EXISTS sp_modven;
DROP PROCEDURE IF EXISTS sp_delven;
DROP PROCEDURE IF EXISTS sp_lisven;
DROP PROCEDURE IF EXISTS sp_busven;
DROP PROCEDURE IF EXISTS sp_searchven;
DROP PROCEDURE IF EXISTS sp_lisdistritos;
DROP PROCEDURE IF EXISTS sp_asignar_distrito_defecto;

-- Eliminar tablas si existen (en orden correcto por las foreign keys)
DROP TABLE IF EXISTS Vendedor;
DROP TABLE IF EXISTS Distrito;

-- Crear la tabla Distrito
CREATE TABLE IF NOT EXISTS Distrito (
    id_distrito INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

-- Insertar distritos
INSERT INTO Distrito (nombre) VALUES
('San Juan de Lurigancho'),
('San Martín de Porres'),
('Ate'),
('Comas'),
('Villa El Salvador'),
('Villa María del Triunfo'),
('San Juan de Miraflores'),
('Los Olivos'),
('Puente Piedra'),
('Santiago de Surco');

-- Crear la tabla Vendedor
CREATE TABLE IF NOT EXISTS Vendedor (
    id_ven INT PRIMARY KEY AUTO_INCREMENT,
    nom_ven VARCHAR(25) NOT NULL,
    ape_ven VARCHAR(25) NOT NULL,
    cel_ven CHAR(9) NOT NULL,
    id_distrito INT,
    FOREIGN KEY (id_distrito) REFERENCES Distrito(id_distrito) ON DELETE SET NULL
);

-- Procedimiento para insertar vendedor
DELIMITER //
CREATE PROCEDURE sp_ingven(
    IN p_nom_ven VARCHAR(25),
    IN p_ape_ven VARCHAR(25),
    IN p_cel_ven CHAR(9),
    IN p_id_distrito INT
)
BEGIN
    DECLARE distrito_exists INT;
    
    -- Validar datos no nulos
    IF p_nom_ven IS NULL OR p_ape_ven IS NULL OR p_cel_ven IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Todos los campos son obligatorios';
    END IF;
    
    -- Validar longitud del celular
    IF LENGTH(p_cel_ven) != 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El número de celular debe tener exactamente 9 dígitos';
    END IF;
    
    -- Validar que el distrito existe
    IF p_id_distrito IS NOT NULL THEN
        SELECT COUNT(*) INTO distrito_exists FROM Distrito WHERE id_distrito = p_id_distrito;
        IF distrito_exists = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El distrito especificado no existe';
        END IF;
    END IF;
    
    INSERT INTO Vendedor(nom_ven, ape_ven, cel_ven, id_distrito)
    VALUES (p_nom_ven, p_ape_ven, p_cel_ven, p_id_distrito);
    
    SELECT LAST_INSERT_ID() AS id_vendedor;
END //
DELIMITER ;

-- Procedimiento para modificar vendedor
DELIMITER //
CREATE PROCEDURE sp_modven(
    IN p_id_ven INT,
    IN p_nom_ven VARCHAR(25),
    IN p_ape_ven VARCHAR(25),
    IN p_cel_ven CHAR(9),
    IN p_id_distrito INT
)
BEGIN
    DECLARE vendedor_exists INT;
    DECLARE distrito_exists INT;
    
    -- Validar que el vendedor existe
    SELECT COUNT(*) INTO vendedor_exists FROM Vendedor WHERE id_ven = p_id_ven;
    IF vendedor_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    -- Validar datos no nulos
    IF p_nom_ven IS NULL OR p_ape_ven IS NULL OR p_cel_ven IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Todos los campos son obligatorios';
    END IF;
    
    -- Validar longitud del celular
    IF LENGTH(p_cel_ven) != 9 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El número de celular debe tener exactamente 9 dígitos';
    END IF;
    
    -- Validar que el distrito existe si se proporciona
    IF p_id_distrito IS NOT NULL THEN
        SELECT COUNT(*) INTO distrito_exists FROM Distrito WHERE id_distrito = p_id_distrito;
        IF distrito_exists = 0 THEN
            SIGNAL SQLSTATE '45000'
            SET MESSAGE_TEXT = 'El distrito especificado no existe';
        END IF;
    END IF;
    
    UPDATE Vendedor 
    SET nom_ven = p_nom_ven,
        ape_ven = p_ape_ven,
        cel_ven = p_cel_ven,
        id_distrito = p_id_distrito
    WHERE id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento para eliminar vendedor
DELIMITER //
CREATE PROCEDURE sp_delven(
    IN p_id_ven INT
)
BEGIN
    DECLARE vendedor_exists INT;
    
    -- Validar que el vendedor existe
    SELECT COUNT(*) INTO vendedor_exists FROM Vendedor WHERE id_ven = p_id_ven;
    IF vendedor_exists = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    DELETE FROM Vendedor WHERE id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento para listar vendedores
DELIMITER //
CREATE PROCEDURE sp_lisven()
BEGIN
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    ORDER BY v.id_ven;
END //
DELIMITER ;

-- Procedimiento para buscar vendedor por ID
DELIMITER //
CREATE PROCEDURE sp_busven(
    IN p_id_ven INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Vendedor WHERE id_ven = p_id_ven) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    WHERE v.id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento para buscar vendedor por texto
DELIMITER //
CREATE PROCEDURE sp_searchven(
    IN p_search VARCHAR(50)
)
BEGIN
    IF p_search IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El término de búsqueda no puede estar vacío';
    END IF;
    
    SELECT v.*, d.nombre as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    WHERE v.nom_ven LIKE CONCAT('%', p_search, '%')
       OR v.ape_ven LIKE CONCAT('%', p_search, '%')
       OR d.nombre LIKE CONCAT('%', p_search, '%')
       OR v.cel_ven LIKE CONCAT('%', p_search, '%')
    ORDER BY v.id_ven;
END //
DELIMITER ;

-- Procedimiento para listar distritos
DELIMITER //
CREATE PROCEDURE sp_lisdistritos()
BEGIN
    SELECT * FROM Distrito ORDER BY nombre;
END //
DELIMITER ;

-- Procedimiento para asignar distrito por defecto
DELIMITER //
CREATE PROCEDURE sp_asignar_distrito_defecto()
BEGIN
    DECLARE primer_distrito INT;
    
    -- Obtener el ID del primer distrito
    SELECT id_distrito INTO primer_distrito FROM Distrito ORDER BY id_distrito LIMIT 1;
    
    -- Actualizar vendedores sin distrito
    UPDATE Vendedor SET id_distrito = primer_distrito WHERE id_distrito IS NULL;
END //
DELIMITER ;

-- Procedimiento para listar vendedores con paginación
DELIMITER //
CREATE PROCEDURE sp_lisven_paginado(
    IN p_limite INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    ORDER BY v.id_ven
    LIMIT p_limite OFFSET p_offset;
END //
DELIMITER ;

-- Procedimiento para buscar vendedor por ID con paginación
DELIMITER //
CREATE PROCEDURE sp_busven_paginado(
    IN p_id_ven INT,
    IN p_limite INT,
    IN p_offset INT
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM Vendedor WHERE id_ven = p_id_ven) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El vendedor especificado no existe';
    END IF;
    
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    WHERE v.id_ven = p_id_ven
    LIMIT p_limite OFFSET p_offset;
END //
DELIMITER ;

-- Procedimiento para buscar vendedor por texto con paginación
DELIMITER //
CREATE PROCEDURE sp_searchven_paginado(
    IN p_search VARCHAR(50),
    IN p_limite INT,
    IN p_offset INT
)
BEGIN
    IF p_search IS NULL THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'El término de búsqueda no puede estar vacío';
    END IF;
    
    SELECT 
        v.*,
        COALESCE(d.nombre, 'Sin distrito') as distrito
    FROM Vendedor v
    LEFT JOIN Distrito d ON v.id_distrito = d.id_distrito
    WHERE v.nom_ven LIKE CONCAT('%', p_search, '%')
       OR v.ape_ven LIKE CONCAT('%', p_search, '%')
       OR d.nombre LIKE CONCAT('%', p_search, '%')
       OR v.cel_ven LIKE CONCAT('%', p_search, '%')
    ORDER BY v.id_ven
    LIMIT p_limite OFFSET p_offset;
END //
DELIMITER ;

-- Crear tabla tipo_cafe si no existe
CREATE TABLE IF NOT EXISTS tipo_cafe (
    id_tipo INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL
);

-- Insertar algunos tipos de café por defecto
INSERT INTO tipo_cafe (nombre, descripcion, precio) VALUES
('Café Americano', 'Café negro con agua caliente', 8.50),
('Café Latte', 'Espresso con leche vaporizada', 12.00),
('Café Moka', 'Espresso con chocolate y leche', 13.50),
('Café Capuccino', 'Espresso con leche espumada', 11.00),
('Café Expresso', 'Café concentrado', 7.00)
ON DUPLICATE KEY UPDATE nombre = VALUES(nombre);

-- Procedimiento para listar tipos de café
DELIMITER //
CREATE PROCEDURE sp_listartiposcafe()
BEGIN
    SELECT * FROM tipo_cafe ORDER BY nombre;
END //
DELIMITER ;

-- Crear tabla Contactos si no existe
CREATE TABLE IF NOT EXISTS Contactos (
    id_contacto INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    telefono VARCHAR(15),
    email VARCHAR(100)
);

-- Procedimiento para insertar contacto
DELIMITER //
CREATE PROCEDURE sp_ingcontacto(
    IN p_nombre VARCHAR(50),
    IN p_telefono VARCHAR(15),
    IN p_email VARCHAR(100)
)
BEGIN
    INSERT INTO Contactos(nombre, telefono, email)
    VALUES (p_nombre, p_telefono, p_email);
    SELECT LAST_INSERT_ID() AS id_contacto;
END //
DELIMITER ;

-- Procedimiento para listar contactos
DELIMITER //
CREATE PROCEDURE sp_listarcontactos()
BEGIN
    SELECT * FROM Contactos ORDER BY id_contacto;
END //
DELIMITER ;

-- Procedimiento para eliminar contacto
DELIMITER //
CREATE PROCEDURE sp_delcontacto(
    IN p_id_contacto INT
)
BEGIN
    DELETE FROM Contactos WHERE id_contacto = p_id_contacto;
END //
DELIMITER ; 