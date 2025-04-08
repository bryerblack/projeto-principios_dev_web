import { Request, Response } from "express";
import { RatingService } from "../services/RatingService";

const ratingService = new RatingService();

export class RatingController {
  // 🔹 Criar uma nova avaliação
  async createRating(req: Request, res: Response) {
    try {
      const { reviewerId, reviewedId, rentId, description, rating } = req.body;

      const newRating = await ratingService.createRating({
        reviewerId,
        reviewedId,
        rentId,
        description,
        rating,
      });

      res.status(201).json(newRating);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao criar avaliação", error: error.message });
      return;
    }
  }

  // 🔹 Listar todas as avaliações
  async getAllRatings(req: Request, res: Response) {
    try {
      const ratings = await ratingService.getAllRatings();
      res.json(ratings);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter avaliações", error: error.message });
      return;
    }
  }

  // 🔹 Buscar avaliação por ID
  async getRatingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rating = await ratingService.getRatingById(id);

      if (!rating) {
        res.status(404).json({ message: "Avaliação não encontrada" });
        return;
      }

      res.json(rating);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter avaliação", error: error.message });
      return;
    }
  }

  async getRatingsByReviewer(req: Request, res: Response) {
    try {
      const { reviewerId } = req.params;
      const ratings = await ratingService.getRatingsByReviewer(reviewerId);
      res.json(ratings);
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao buscar avaliações", error: error.message });
    }
  }

  // 🔹 Deletar uma avaliação por ID
  async deleteRating(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ratingService.deleteRating(id);
      res.json({ message: "Avaliação deletada com sucesso" });
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar avaliação", error: error.message });
      return;
    }
  }

  async rateUser(req: Request, res: Response) {
    try {
      const { reviewerId, reviewedId, rentId, description, rating } = req.body;

      const newRating = await ratingService.createRating({
        reviewerId,
        reviewedId,
        rentId,
        description,
        rating,
      });

      await ratingService.updateUserAverageRating(reviewedId);

      res.status(201).json(newRating);
      return;
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao avaliar usuário", error: error.message });
      return;
    }
  }
}
