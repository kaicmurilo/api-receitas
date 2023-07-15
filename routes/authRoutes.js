const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Rota para verificar o token
router.get("/verify-token", authController.verifyToken);

module.exports = router;
