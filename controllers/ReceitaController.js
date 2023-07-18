const jwt = require("jsonwebtoken");
const Receita = require("../models/Receita");
const User = require("../models/User");

exports.cadastrarReceita = async (req, res) => {
  const { nomeReceita, ingredientes, modoPreparo } = req.body;

  try {
    let userId = "";
    // Verificar o nome do usuário cadastrando a receita
    jwt.verify(req.body.dadosToken, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Token inválido" });
      }
      userId = decoded.userId;
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    const idCadastrou = userId;
    // Verificar a última receita cadastrada
    const ultimaReceita = await Receita.findOne().sort({ dataPostagem: -1 });

    let pagina = 1; // Página padrão para a primeira receita

    if (ultimaReceita) {
      // Verificar a quantidade de receitas na última página
      const receitasUltimaPagina = await Receita.find({
        pagina: ultimaReceita.pagina,
      })
        .sort({ dataPostagem: -1 })
        .lean();

      if (receitasUltimaPagina.length >= 3) {
        // Todas as 3 últimas receitas estão na última página, incrementar a página
        pagina = ultimaReceita.pagina + 1;
      } else {
        // Página atual é a última página
        pagina = ultimaReceita.pagina;
      }
    }

    // Criar nova receita
    const novaReceita = new Receita({
      nomeReceita,
      ingredientes,
      modoPreparo,
      idCadastrou,
      pagina,
    });

    await novaReceita.save();

    res.json({ message: "Receita cadastrada com sucesso", status: true });
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
    const receitas = await Receita.find().lean();

    for (let i = 0; i < receitas.length; i++) {
      const userId = receitas[i].idCadastrou;
      const user = await User.findById(userId);

      if (user) {
        receitas[i].nomeCadastrou = user.nome + " " + user.sobrenome;
      }
    }

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

    for (let i = 0; i < receitas.length; i++) {
      const userId = receitas[i].idCadastrou;
      const user = await User.findById(userId);

      if (user) {
        receitas[i].nomeCadastrou = user.nome + " " + user.sobrenome;
      }
    }

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

    const userId = receita.idCadastrou;
    const user = await User.findById(userId);

    if (user) {
      receita.nomeCadastrou = user.nome + " " + user.sobrenome;
    }

    res.json(receita);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter a receita" });
  }
};

exports.obterMinhasReceitas = async (req, res) => {
  try {
    let userId = "";
    if (!req.headers["authorization"]) {
      console.log("sem token");
      return res.status(401).json({
        error: "Você precisa estar autenticado para utilizar o serviço.",
      });
    }

    // Verificar o nome do usuário cadastrando a receita
    jwt.verify(
      req.headers["authorization"],
      process.env.JWT_SECRET,
      (err, decoded) => {
        if (err) {
          return res.status(401).json({ error: "Token inválido" });
        }
        userId = decoded.userId;
      }
    );

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    const receitas = await Receita.find({ idCadastrou: user._id });
    res.json(receitas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocorreu um erro ao buscar as receitas." });
  }
};
