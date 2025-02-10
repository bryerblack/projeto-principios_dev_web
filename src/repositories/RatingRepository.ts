import Rating from "../models/Rating";

export class RatingRepository {
  async createRating(data: {
    reviewerId: string;
    reviewedId: string;
    rentId: string;
    description?: string;
    rating: number;
  }) {
    return await Rating.create(data);
  }

  async getAllRatings() {
    return await Rating.findAll();
  }

  async getRatingById(id: string) {
    return await Rating.findByPk(id);
  }

  async deleteRating(id: string) {
    return await Rating.destroy({ where: { id } });
  }
}
