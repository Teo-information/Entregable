const db = require('../config/db');

exports.insertarContacto = (nombre, correo, telefono, callback) => {
  db.query("CALL sp_insertar_contacto(?, ?, ?)", [nombre, correo, telefono], callback);
};
