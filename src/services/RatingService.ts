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
    return await ratingRepository.createRating(data);
  }

  async updateUserAverageRating(userId: string) {
    const ratings = await ratingRepository.getRatingsByReviewedId(userId);
    if (ratings.length === 0) return;

    const average =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await userRepository.updateUser(userId, { averageRating: average });
  }

  async updatePlaceAverageRating(placeId: string) {
    const ratings = await ratingRepository.getRatingsByReviewedId(placeId);
    if (ratings.length === 0) return;

    const average =
      ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;

    await placeRepository.updatePlace(placeId, { averageRating: average });
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
