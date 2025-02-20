import { RatingRepository } from "../repositories/RatingRepository";

const ratingRepository = new RatingRepository();

export class RatingService {
  async createRating(data: {
    reviewerId: string;
    reviewedId: string;
    rentId: string;
    description?: string;
    rating: number;
  }) {
    return await ratingRepository.createRating(data);
  }

  async getAllRatings() {
    return await ratingRepository.getAllRatings();
  }

  async getRatingById(id: string) {
    return await ratingRepository.getRatingById(id);
  }

  async deleteRating(id: string) {
    return await ratingRepository.deleteRating(id);
  }
}
