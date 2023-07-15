const mongoose = require("mongoose");

const ReceitaSchema = new mongoose.Schema({
  nomeReceita: {
    type: String,
    required: true,
  },
  ingredientes: {
    type: String,
    required: true,
  },
  modoPreparo: {
    type: String,
    required: true,
  },
  dataPostagem: {
    type: Date,
    default: Date.now,
  },
  nomeCadastrou: {
    type: String,
    required: true,
  },
  comentarios: [
    {
      comentario: {
        type: String,
        required: true,
      },
      nomePessoa: {
        type: String,
        required: true,
      },
    },
  ],
});

const Receita = mongoose.model("Receita", ReceitaSchema);

module.exports = Receita;
