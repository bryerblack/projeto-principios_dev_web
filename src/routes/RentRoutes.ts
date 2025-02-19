import { Router } from "express";
import { RentController } from "../controllers/RentController";

const router = Router();
const rentController = new RentController();

// 🔹 Criar uma nova locação
router.post("/", (req, res) => rentController.createRent(req, res));

// 🔹 Listar todas as locações
router.get("/", (req, res) => rentController.getAllRents(req, res));

// 🔹 Buscar locação por ID
router.get("/:id", (req, res) => {
  rentController.getRentById(req, res);
  return;
});

// 🔹 Atualizar locação por ID
router.put("/:id", (req, res) => {
  rentController.updateRent(req, res);
  return;
});

// 🔹 Deletar locação por ID
router.delete("/:id", (req, res) => rentController.deleteRent(req, res));

export default router;
