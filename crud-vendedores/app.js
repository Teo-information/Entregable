// Asumiendo que app.js está en la raíz del proyecto, no en la carpeta views
const express = require("express");
const path = require("path");
const app = express();

// Para servir archivos estáticos como CSS, imágenes, JS
app.use(express.static(path.join(__dirname, 'public')));

// Configuraciones
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Importar rutas
const vendedoresRoutes = require("./routes/vendedores");

// Registrar rutas
app.use("/vendedores", vendedoresRoutes);

// Ruta principal que muestra el index.html del café
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Ruta para delivery que renderiza index.ejs
app.get('/delivery', (req, res) => {
  res.render('index');
});

// Manejo de errores 404
app.use((req, res, next) => {
  res.status(404).send("Página no encontrada");
});

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

module.exports = app;