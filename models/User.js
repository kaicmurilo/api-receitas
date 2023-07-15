const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: String,
  sobrenome: String,
  email: String,
  senha: String,
});

module.exports = mongoose.model("User", userSchema);
