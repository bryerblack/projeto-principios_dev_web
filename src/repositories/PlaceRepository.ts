import Address from "../models/Address";
import Place from "../models/Place";

export class PlaceRepository {
  async createPlace(data: {
    name: string;
    addressId: string;
    description?: string;
    pricePerTurn: number;
    availability: {
      day: string;
      availableTurns: string[];
    }[];
    ownerId: string;
  }) {
    return await Place.create(data);
  }

  async getAllPlaces() {
    return await Place.findAll({ include: [{ model: Address, as: "address" }] });
  }

  async getPlaceById(id: string) {
    return await Place.findByPk(id, { include: [{ model: Address, as: "address" }] });
  }

  async deletePlace(id: string) {
    return await Place.destroy({ where: { id } });
  }

  async getPlacesByOwner(ownerId: string) {
    return await Place.findAll({ where: { ownerId: ownerId } });
  }

  async getPlaceByAddress(addressId: string) {
    return await Place.findOne({ where: { addressId }, include: [{ model: Address, as: "address" }] });
  }

  async updatePlace(id: string, data: Partial<Place>) {
    const place = await Place.findByPk(id);
    if (!place) return null;
    return await place.update(data);
  }

  async findAvailablePlaces(limit: number, offset: number) {
    const { count, rows } = await Place.findAndCountAll({
      where: {
        availability: {
          [Symbol.for("sequelize.json")]: {
            [Symbol.for("sequelize.ne")]: [],
          },
        },
      },
      include: [{ model: Address, as: "address" }], // 🔹 Inclui o endereço completo
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      total: count,
      places: rows,
    };
  }
}
