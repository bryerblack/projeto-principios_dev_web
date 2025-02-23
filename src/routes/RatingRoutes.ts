import { Router } from "express";
import { RatingController } from "../controllers/RatingController";

const router = Router();
const ratingController = new RatingController();

// 🔹 Criar uma nova avaliação
router.post("/", (req, res) => ratingController.createRating(req, res));

// 🔹 Listar todas as avaliações
router.get("/", (req, res) => ratingController.getAllRatings(req, res));

// 🔹 Buscar avaliação por ID
router.get("/:id", (req, res) => {
  ratingController.getRatingById(req, res);
  return;
});

// 🔹 Deletar avaliação por ID
router.delete("/:id", (req, res) => ratingController.deleteRating(req, res));

export default router;
