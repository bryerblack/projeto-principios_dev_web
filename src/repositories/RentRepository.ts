import { Transaction } from "sequelize";
import Rent from "../models/Rent";

export class RentRepository {
  static sequelize: any;

  async createRent(
    data: {
      placeId: string;
      ownerId: string;
      renterId: string;
      totalValue: number;
      status: string;
      paymentMethod: string;
      schedules: { day: string; turns: string[] }[];
    },
    transaction?: Transaction
  ) {
    return await Rent.create(
      {
        placeId: data.placeId,
        ownerId: data.ownerId,
        renterId: data.renterId,
        totalValue: data.totalValue,
        status: data.status,
        paymentMethod: data.paymentMethod,
        schedules: data.schedules,
      },
      { transaction }
    );
  }

  async getAllRents() {
    return await Rent.findAll();
  }

  async getRentById(id: string) {
    return await Rent.findByPk(id);
  }

  async getRentsByUser(userId: string) {
    return await Rent.findAll({ where: { renterId: userId } });
  }

  async updateRent(id: string, data: Partial<Rent>) {
    const rent = await Rent.findByPk(id);
    if (!rent) return null;
    await rent.update(data);
    return rent;
  }

  async updateRentStatus(rentId: string, status: string) {
    return await Rent.update({ status }, { where: { id: rentId } });
  }

  async getActiveRentsByPlace(placeId: string) {
    return await Rent.findAll({
      where: {
        placeId,
        status: "confirmado",
      },
    });
  }

  async deleteRent(id: string) {
    return await Rent.destroy({ where: { id } });
  }
}
