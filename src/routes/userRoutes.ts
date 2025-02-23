import { Router } from "express";
import { UserController } from "../controllers/UserController";

const router = Router();
const userController = new UserController();

router.post('', (req, res) => userController.createUser(req, res));

router.get('', (req, res) => userController.getAllUsers(req, res));

router.get(':id', (req, res) => {
  userController.getUserById(req, res);
  return;
});

router.delete(':id', (req, res) => userController.deleteUser(req, res));

export default router;
