import { PlaceRepository } from "../repositories/PlaceRepository";
import { RatingRepository } from "../repositories/RatingRepository";
import { UserRepository } from "../repositories/UserRepository";

const ratingRepository = new RatingRepository();
const userRepository = new UserRepository();
const placeRepository = new PlaceRepository();

export class RatingService {
  async createRating(data: {
    reviewerId: string;
    reviewedId: string;
    rentId: string;
    description?: string;
    rating: number;
  }) {
    const newRating = await ratingRepository.createRating(data);

    await this.updateUserAverageRating(data.reviewedId);

    return newRating;
  }

  async updateUserAverageRating(userId: string) {
    const user = await userRepository.getUserById(userId);
    if (!user) return;

    const ratings = await ratingRepository.getRatingsByReviewedId(userId);
    if (ratings.length === 0) return;

    const average =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await userRepository.updateUser(userId, { averageRating: average });
  }

  async getRatingsByReviewer(reviewerId: string) {
    return await ratingRepository.getRatingsByReviewer(reviewerId);
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
