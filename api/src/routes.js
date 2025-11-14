// src/routes.js
const express = require("express");
const router = express.Router();

const usuarioController = require("./controllers/usuarioController");
const documentoController = require("./controllers/documentoController");
const pacienteController = require("./controllers/pacienteController");
const notaController = require("./controllers/notaController");

router.post("/api/usuarios", usuarioController.create); // cadastro
router.post("/api/login", usuarioController.login); // login separado
router.get("/api/usuarios", usuarioController.read);
router.get("/api/usuarios/:id", usuarioController.readById);
router.put("/api/usuarios/:id", usuarioController.update);
router.delete("/api/usuarios/:id", usuarioController.delete);

router.post("/api/notas", notaController.create);
router.get("/api/notas/:usuarioId", notaController.listAll);
router.get("/api/notas/item/:id", notaController.getById);
router.put("/api/notas/:id", notaController.update);
router.delete("/api/notas/:id", notaController.delete);

router.get("/api/notas/favoritos/:usuarioId", notaController.favoritos);
router.get("/api/notas/recentes/:usuarioId", notaController.recentes);
router.get("/api/notas/selecionado/:usuarioId", notaController.selecionadoList);
router.get("/api/notas/templates/:usuarioId", notaController.templates);
router.get("/api/notas/buscar/:usuarioId", notaController.search);

router.patch("/api/notas/favorito/:id", notaController.toggleFavorito);
router.patch("/api/notas/selecionado/:id", notaController.toggleSelecionado);

// 📎 DOCUMENTOS
router.post("/api/documentos", documentoController.create);
router.get("/api/documentos", documentoController.read);
router.put("/api/documentos/:id", documentoController.update);
router.delete("/api/documentos/:id", documentoController.delete);

// 👨‍⚕️ PACIENTES
router.post("/api/pacientes", pacienteController.create);
router.get("/api/pacientes", pacienteController.read);
router.put("/api/pacientes/:id", pacienteController.update);
router.delete("/api/pacientes/:id", pacienteController.delete);

module.exports = router;
