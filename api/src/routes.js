// src/routes.js
const express = require("express");
const router = express.Router();

const usuarioController = require("./controllers/usuarioController");
const documentoController = require("./controllers/documentoController");
const pacienteController = require("./controllers/pacienteController");

router.post("/api/usuarios", usuarioController.create); // cadastro
router.post("/api/login", usuarioController.login); // login separado
router.get("/api/usuarios", usuarioController.read);
router.get("/api/usuarios/:id", usuarioController.readById);
router.put("/api/usuarios/:id", usuarioController.update);
router.delete("/api/usuarios/:id", usuarioController.delete);



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
