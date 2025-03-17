import { Router } from "express";
import { AuthController } from "../controllers/AuthController";
import validateUser from "../middlewares/ValidationMiddleware"; // Importa o middleware de validação

const router = Router();
const authController = new AuthController();

router.post("/register", validateUser, (req, res) => authController.register(req, res));

router.post("/login", validateUser, (req, res) => authController.login(req, res));

export default router;
