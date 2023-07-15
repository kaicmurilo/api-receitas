const Receita = require("../models/Receita");

// Função para cadastrar uma nova receita
exports.cadastrarReceita = async (req, res) => {
  const { nomeReceita, ingredientes, modoPreparo, nomeCadastrou } = req.body;

  try {
    const novaReceita = new Receita({
      nomeReceita,
      ingredientes,
      modoPreparo,
      nomeCadastrou,
    });
    await novaReceita.save();

    res.json({ message: "Receita cadastrada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar a receita" });
  }
};

// Função para adicionar um comentário a uma receita
exports.adicionarComentario = async (req, res) => {
  const { comentario, nomePessoa } = req.body;
  const { receitaId } = req.params;

  try {
    const receita = await Receita.findById(receitaId);
    if (!receita) {
      return res.status(404).json({ error: "Receita não encontrada" });
    }

    receita.comentarios.push({ comentario, nomePessoa });
    await receita.save();

    res.json({ message: "Comentário adicionado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar o comentário" });
  }
};

// Função para obter todas as receitas
exports.obterTodasReceitas = async (req, res) => {
  try {
    const receitas = await Receita.find();
    res.json(receitas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter as receitas" });
  }
};

// Função para obter uma receita pelo ID
exports.obterReceitaPorId = async (req, res) => {
  const { receitaId } = req.params;

  try {
    const receita = await Receita.findById(receitaId);
    if (!receita) {
      return res.status(404).json({ error: "Receita não encontrada" });
    }
    res.json(receita);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter a receita" });
  }
};
