const express = require("express");
const cors = require("cors");
const path = require("path");
const routes = require("./src/routes");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Usa as rotas principais
app.use("/", routes);

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
