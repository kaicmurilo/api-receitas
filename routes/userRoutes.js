const express = require("express");
const router = express.Router();
const UserController = require("../controllers/UserController");

// Rota para logar um usuário
router.post("/users/login", UserController.login);
// Rota para obter a lista de usuários (rota protegida)
router.get("/users", UserController.verifyToken, UserController.getUsers);

// Rota para obter um usuário pelo ID (rota protegida)
router.get(
  "/users/:id",
  UserController.verifyToken,
  UserController.getUserById
);

// Rota para atualizar um usuário (rota protegida)
router.put("/users/:id", UserController.verifyToken, UserController.updateUser);

// Rota para excluir um usuário (rota protegida)
router.delete(
  "/users/:id",
  UserController.verifyToken,
  UserController.deleteUser
);

router.get("/token", UserController.generateToken);

module.exports = router;
