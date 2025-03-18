import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();
const userController = new UserController();

// 🔹 Criar um novo usuário (Apenas Admins)
router.post("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.createUser(req, res)
);

// 🔹 Nova rota: Obter informações do próprio usuário (Qualquer usuário autenticado)
router.get("/me", authMiddleware, (req, res) =>
  userController.getSelf(req, res)
);

// 🔹 Buscar usuário por Email (Apenas Admins)
router.get(
  "/email/:email",
  authMiddleware,
  roleMiddleware(["admin"]),
  (req, res) => userController.getUserByEmail(req, res)
);

// 🔹 Listar todos os usuários (Apenas Admins)
router.get("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.getAllUsers(req, res)
);

// 🔹 Buscar usuário por ID (Apenas Admins)
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.getUserById(req, res)
);

// 🔹 Atualizar usuário (Apenas Admins)
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.updateUser(req, res)
);

// 🔹 Deletar usuário (Apenas Admins)
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  userController.deleteUser(req, res)
);

export default router;
