require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
// Configurar o body-parser
app.use(express.json()); // Para analisar o corpo das solicitações como JSON
app.use(express.urlencoded({ extended: true })); // Para analisar corpos de solicitação codificados em URL

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Rotas da API
app.use("/", userRoutes);
app.use("/auth", authRoutes);

// Iniciar o servidor
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
