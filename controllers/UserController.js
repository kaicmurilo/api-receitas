const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware para verificar o token em rotas protegidas
exports.verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Token inválido" });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Função para cadastrar um novo usuário
exports.signup = async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  try {
    // Verificar se o usuário já está cadastrado
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: "Usuário já cadastrado" });
    }

    // Criptografar a senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar novo usuário
    const newUser = new User({
      nome,
      sobrenome,
      email,
      senha: hashedPassword,
    });
    await newUser.save();

    res.json({ message: "Usuário cadastrado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao cadastrar o usuário" });
  }
};

// Função para fazer login do usuário
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

// Função para obter a lista de usuários
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({}, { senha: 0 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuários" });
  }
};

// Função para obter um usuário pelo ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id, { senha: 0 });
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter usuário" });
  }
};

// Função para atualizar um usuário
exports.updateUser = async (req, res) => {
  const { nome, sobrenome, email, senha } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    user.nome = nome;
    user.sobrenome = sobrenome;
    user.email = email;
    if (senha) {
      user.senha = await bcrypt.hash(senha, 10);
    }
    await user.save();

    res.json({ message: "Usuário atualizado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar usuário" });
  }
};

// Função para excluir um usuário
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }
    res.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir usuário" });
  }
};

//remover posteriormente
exports.generateToken = async (req, res) => {
  // Verificar se a requisição está vindo do ambiente local
  const isLocalhost =
    req.connection.remoteAddress === "127.0.0.1" ||
    req.connection.remoteAddress === "::1" ||
    req.headers.host.includes("localhost");

  if (!isLocalhost) {
    return res.status(403).json({ error: "Acesso negado" });
  }

  try {
    const user = await User.findOne({ email: "kaicmurilo@live.com" });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao gerar token" });
  }
};
