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
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao criar avaliação", error: error.message });
    }
  }

  // 🔹 Listar todas as avaliações
  async getAllRatings(req: Request, res: Response) {
    try {
      const ratings = await ratingService.getAllRatings();
      res.json(ratings);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter avaliações", error: error.message });
    }
  }

  // 🔹 Buscar avaliação por ID
  async getRatingById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const rating = await ratingService.getRatingById(id);

      if (!rating) {
        return res.status(404).json({ message: "Avaliação não encontrada" });
      }

      res.json(rating);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao obter avaliação", error: error.message });
    }
  }

  // 🔹 Deletar uma avaliação por ID
  async deleteRating(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await ratingService.deleteRating(id);
      res.json({ message: "Avaliação deletada com sucesso" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: "Erro ao deletar avaliação", error: error.message });
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
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao avaliar usuário", error: error.message });
    }
  }
  
  async ratePlace(req: Request, res: Response) {
    try {
      const { reviewerId, reviewedId, rentId, description, rating } = req.body;
  
      const newRating = await ratingService.createRating({
        reviewerId,
        reviewedId,
        rentId,
        description,
        rating,
      });
  
      await ratingService.updatePlaceAverageRating(reviewedId);
  
      res.status(201).json(newRating);
    } catch (error: any) {
      res.status(500).json({ message: "Erro ao avaliar lugar", error: error.message });
    }
  }
}
