import Place from "../models/Place";

export class PlaceRepository {
  async createPlace(data: {
    name: string;
    address: object;
    description?: string;
    pricePerHour: number;
    availability: string[];
    ownerId: string;
  }) {
    return await Place.create(data);
  }

  async getAllPlaces() {
    return await Place.findAll();
  }

  async getPlaceById(id: string) {
    return await Place.findByPk(id);
  }

  async updatePlace(id: string, data: Partial<Place>) {
    const place = await Place.findByPk(id);
    if (!place) return null;
    return await place.update(data);
  }

  async deletePlace(id: string) {
    return await Place.destroy({ where: { id } });
  }
}
