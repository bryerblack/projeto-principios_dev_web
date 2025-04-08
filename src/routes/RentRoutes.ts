import { Router } from "express";
import { RentController } from "../controllers/RentController";
import { authMiddleware } from "../middlewares/AuthMiddleware";
import { roleMiddleware } from "../middlewares/RoleMiddleware";

const router = Router();
const rentController = new RentController();

// 🔹 Listar places disponíveis para aluguel com paginação
router.get(
  "/available",
  rentController.getAvailablePlaces.bind(rentController)
);

// 🔹 Usuário pode solicitar um aluguel
router.post(
  "/request",
  authMiddleware,
  rentController.requestRent.bind(rentController)
);

router.put("/:id/finalize", authMiddleware, rentController.finalizeRent.bind(rentController));

// 🔹 Dono do espaço pode aprovar ou rejeitar solicitação de aluguel
router.put(
  "/:id/approve",
  authMiddleware,
  rentController.approveOrRejectRent.bind(rentController)
);

// 🔹 Usuário autenticado pode visualizar suas locações
router.get(
  "/me",
  authMiddleware,
  rentController.getUserRents.bind(rentController)
);

// 🔹 Criar aluguel diretamente (admin ou funcionalidade avançada)
router.post(
  "/",
  authMiddleware,
  rentController.createRent.bind(rentController)
);

// 🔹 Usuário pode cancelar um aluguel próprio pendente
router.put(
  "/:id/cancel",
  authMiddleware,
  rentController.cancelRent.bind(rentController)
);

// 🔹 Atualizar locação (por enquanto não muito usado, mas mantido)
router.put(
  "/:id",
  authMiddleware,
  rentController.updateRent.bind(rentController)
);

// 🔹 Deletar locação (geralmente só admin)
router.delete(
  "/:id",
  authMiddleware,
  rentController.deleteRent.bind(rentController)
);

// 🔹 Apenas admin pode visualizar todas as locações
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  rentController.getAllRents.bind(rentController)
);

// 🔹 Apenas admin pode visualizar uma locação específica
router.get(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  rentController.getRentById.bind(rentController)
);

export default router;
