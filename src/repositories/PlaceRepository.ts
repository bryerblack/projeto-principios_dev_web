import Address from "../models/Address";
import Place from "../models/Place";

export class PlaceRepository {
  async createPlace(data: {
    name: string;
    addressId: string;
    description?: string;
    pricePerHour: number;
    availability: string[];
    ownerId: string;
  }) {
    return await Place.create(data);
  }

  async getAllPlaces() {
    return await Place.findAll({ include: [{ model: Address }] });
  }

  async getPlaceById(id: string) {
    return await Place.findByPk(id, { include: [{ model: Address }] });
  }

  async deletePlace(id: string) {
    return await Place.destroy({ where: { id } });
  }

  async getPlacesByOwner(ownerId: string) {
    return await Place.findAll({ where: { ownerId: ownerId } });
  }

  async getPlaceByAddress(addressId: string) {
    return await Place.findOne({ where: { addressId }, include: [Address] });
  }

  async updatePlace(id: string, data: Partial<Place>) {
    const place = await Place.findByPk(id);
    if (!place) return null;
    return await place.update(data);
  }

  async findAvailablePlaces(limit: number, offset: number) {
    const { count, rows } = await Place.findAndCountAll({
      where: {
        isAvailable: true, // Apenas places disponíveis
      },
      limit,
      offset,
      order: [["createdAt", "DESC"]], // 🔹 Ordena do mais recente para o mais antigo
    });

    return {
      total: count, // Número total de places disponíveis
      places: rows, // Lista de places retornados na página
    };
  }
}
