import { Request, Response } from "express";
import { RatingService } from "../services/RatingService";

const ratingService = new RatingService();

export class RatingController {
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
}
