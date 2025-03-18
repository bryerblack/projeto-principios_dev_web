import { Router } from "express";
import { RentController } from "../controllers/RentController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();
const rentController = new RentController();

// 🔹 Usuário pode solicitar um aluguel
router.post("/request", authMiddleware, (req, res) =>
  rentController.requestRent(req, res)
);

// 🔹 Dono do espaço pode aprovar ou rejeitar solicitação de aluguel
router.put("/:id/approve", authMiddleware, (req, res) =>
  rentController.approveOrRejectRent(req, res)
);

// 🔹 Usuário autenticado pode visualizar suas locações
router.get("/me", authMiddleware, (req, res) =>
  rentController.getUserRents(req, res)
);

// 🔹 Usuário pode criar um aluguel se tiver pelo menos um espaço criado
router.post("/", authMiddleware, (req, res) =>
  rentController.createRent(req, res)
);

// 🔹 Usuário pode editar um aluguel se tiver pelo menos um espaço criado
router.put("/:id", authMiddleware, (req, res) =>
  rentController.updateRent(req, res)
);

// 🔹 Usuário pode deletar um aluguel se tiver pelo menos um espaço criado
router.delete("/:id", authMiddleware, (req, res) =>
  rentController.deleteRent(req, res)
);

// 🔹 Usuário pode cancelar um aluguel próprio pendente
router.put("/:id/cancel", authMiddleware, (req, res) =>
  rentController.cancelRent(req, res)
);

// 🔹 Apenas admin pode visualizar todas as locações
router.get("/", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  rentController.getAllRents(req, res)
);

// 🔹 Apenas admin pode visualizar uma locação específica
router.get("/:id", authMiddleware, roleMiddleware(["admin"]), (req, res) =>
  rentController.getRentById(req, res)
);

export default router;
