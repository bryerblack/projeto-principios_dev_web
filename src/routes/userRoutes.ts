import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post('', (req, res) => userController.createUser(req, res));

router.get('', (req, res) => userController.getAllUsers(req, res));

// 🔹 Buscar usuário por ID
router.get('/:id', (req, res) => {
  userController.getUserById(req, res);
  return;
});

router.get('/email/:email', (req, res) => {
  userController.getUserByEmail(req, res);
  return;
});

router.put('/:id', (req, res) => userController.updateUser(req, res));

// 🔹 Deletar usuário por ID
router.delete('/:id', (req, res) => userController.deleteUser(req, res));

export default router;
