const Contacto = require('../models/contacto.model');

const guardarContacto = (req, res) => {
  const { nombre, correo, telefono } = req.body;

  console.log("BODY RECIBIDO:", req.body); // Verifica si llega

  Contacto.insertarContacto(nombre, correo, telefono, (err, result) => {
    if (err) {
      console.error("Error al insertar contacto:", err);
      return res.status(500).json({ mensaje: "Error al guardar" });
    }
    res.status(200).json({ mensaje: "Contacto guardado correctamente" });
  });
};

module.exports = { guardarContacto };