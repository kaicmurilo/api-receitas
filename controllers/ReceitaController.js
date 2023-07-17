const jwt = require("jsonwebtoken");
const Receita = require("../models/Receita");

exports.cadastrarReceita = async (req, res) => {
  const { nomeReceita, ingredientes, modoPreparo } = req.body;
  console.log(req.body);
  var nomeCadastrou = "";

  try {
    // Verificar a última receita cadastrada
    jwt.verify(req.body.dadosToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido" });
      }
      nomeCadastrou = decoded.nome;
    });
    const ultimaReceita = await Receita.findOne().sort({ dataPostagem: -1 });

    let pagina = 1; // Página padrão para a primeira receita
    if (ultimaReceita) {
      // Verificar a quantidade de receitas na última página
      const receitasUltimaPagina = await Receita.find()
        .sort({ dataPostagem: -1 })
        .limit(3)
        .lean();

      if (receitasUltimaPagina.length === 3) {
        // Todas as 3 últimas receitas estão na última página, incrementar a página
        pagina = Math.ceil(receitasUltimaPagina[2].id / 3) + 1;
      } else {
        // Página atual é a última página
        pagina = Math.ceil(ultimaReceita.id / 3);
      }
    }

    // Criar nova receita
    const novaReceita = new Receita({
      nomeReceita,
      ingredientes,
      modoPreparo,
      nomeCadastrou,
      pagina,
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
    console.log("entrou");
    const receitas = await Receita.find();
    res.json(receitas);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter as receitas" });
  }
};

// Função para obter as receitas paginadas
exports.obterReceitasPorPagina = async (req, res) => {
  const pagina = parseInt(req.params.page);

  try {
    const receitas = await Receita.find({ pagina }).lean();

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
