import Rent from "../models/Rent";

export class RentRepository {
  async createRent(data: { placeId: string; ownerId: string; renterId: string; totalValue: number; dateTimes: string[]; status: string; paymentMethod: string }) {
    return await Rent.create(data);
  }

  async getAllRents() {
    return await Rent.findAll();
  }

  async getRentById(id: string) {
    return await Rent.findByPk(id);
  }

  async updateRent(id: string, data: Partial<Rent>) {
    const rent = await Rent.findByPk(id);
    if (!rent) return null;
    return await rent.update(data);
  }

  async deleteRent(id: string) {
    return await Rent.destroy({ where: { id } });
  }
}
