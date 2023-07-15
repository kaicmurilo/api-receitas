const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Função para verificar o token JWT
exports.verifyToken = (req, res) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }
    return res.status(200).json({ decoded });
  });
};

exports.login = async (req, res) => {
  console.log("login");
  const { email, senha } = req.body;
  try {
    // Verificar se o usuário existe
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Usuário não encontrado" });
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(senha, user.senha);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    // Gerar token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
};
