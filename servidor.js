const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// servir archivos estáticos
app.use(express.static(path.join(__dirname, "frontend")));

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});