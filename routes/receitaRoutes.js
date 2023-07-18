const express = require("express");
const router = express.Router();
const receitaController = require("../controllers/ReceitaController");

// Rota para cadastrar uma nova receita
router.post("/nova", receitaController.cadastrarReceita);

// Rota para obter minhas receitas
router.get("/minhasreceitas", receitaController.obterMinhasReceitas);

// Rota para adicionar um comentário a uma receita
router.post(
  "/receitas/:receitaId/comentarios",
  receitaController.adicionarComentario
);

// Rota para obter todas as receitas
router.get("/:page", receitaController.obterReceitasPorPagina);

// Rota para obter uma receita pelo ID
router.get("/receitas/:receitaId", receitaController.obterReceitaPorId);

// Rota para obter todas as receitas
router.get("/", receitaController.obterTodasReceitas);

module.exports = router;
