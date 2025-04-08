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

  async updateRating(
    id: string,
    data: Partial<{ description: string; rating: number }>
  ) {
    const rating = await Rating.findByPk(id);
    if (!rating) return null;
    return await rating.update(data);
  }

  async getRatingsByReviewedId(reviewedId: string) {
    return await Rating.findAll({
      where: { reviewedId },
    });
  }

  async getRatingsByReviewer(reviewerId: string) {
    return await Rating.findAll({
      where: { reviewerId },
    });
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
