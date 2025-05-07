-- Procedimiento para listar tipos de café
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_listartiposcafe()
BEGIN
    SELECT id_cafe, nombre, descripcion, precio
    FROM tipo_cafe
    ORDER BY nombre;
END //
DELIMITER ;

-- Procedimiento para buscar un vendedor por ID
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_busven(IN p_id_ven INT)
BEGIN
    SELECT v.*, d.nom_distrito as distrito, c.nombre as tipo_cafe
    FROM vendedor v
    LEFT JOIN distrito d ON v.id_distrito = d.id_distrito
    LEFT JOIN tipo_cafe c ON v.id_cafe = c.id_cafe
    WHERE v.id_ven = p_id_ven;
END //
DELIMITER ;

-- Procedimiento para actualizar un vendedor
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS sp_modven(
    IN p_id_ven INT,
    IN p_nom_ven VARCHAR(50),
    IN p_ape_ven VARCHAR(50),
    IN p_cel_ven VARCHAR(9),
    IN p_id_distrito INT,
    IN p_id_cafe INT
)
BEGIN
    UPDATE vendedor
    SET nom_ven = p_nom_ven,
        ape_ven = p_ape_ven,
        cel_ven = p_cel_ven,
        id_distrito = p_id_distrito,
        id_cafe = p_id_cafe
    WHERE id_ven = p_id_ven;
END //
DELIMITER ; 