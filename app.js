const express = require("express");
const path = require("path");
const app = express();

// Configuración de EJS para las vistas dinámicas
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public"))); // Sirve archivos estáticos


const contactoRoutes = require('./routes/contacto.routes');
app.use('/api', contactoRoutes);

// Importar rutas de vendedores
const vendedoresRoutes = require("./routes/vendedores");
app.use("/vendedores", vendedoresRoutes);

// Ruta principal: Sirve el index.html estático (página del café)
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Ruta /delivery: Muestra el sistema de vendedores
app.get("/delivery", (req, res) => {
  res.redirect("/vendedores"); // Redirige al sistema de vendedores
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).send("Página no encontrada");
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
