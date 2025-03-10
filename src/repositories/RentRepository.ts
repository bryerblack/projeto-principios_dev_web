import { Transaction } from "sequelize";
import Rent from "../models/Rent";
import RentSchedule from "../models/RentSchedule";

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
      schedules: { startDate: string; endDate: string }[];
    },
    transaction?: Transaction
  ) {
    return await Rent.sequelize!.transaction(async (t) => {
      const rentTransaction = transaction || t;

      const rent = await Rent.create(
        {
          placeId: data.placeId,
          ownerId: data.ownerId,
          renterId: data.renterId,
          totalValue: data.totalValue,
          status: data.status,
          paymentMethod: data.paymentMethod,
        },
        { transaction: rentTransaction }
      );

      if (data.schedules.length > 0) {
        const schedules = data.schedules.map((schedule) => ({
          rentId: rent.id,
          startDate: new Date(schedule.startDate),
          endDate: new Date(schedule.endDate),
        }));

        await RentSchedule.bulkCreate(schedules, {
          transaction: rentTransaction,
        });
      }

      return rent;
    });
  }

  async getAllRents() {
    return await Rent.findAll();
  }

  async getRentById(id: string) {
    return await Rent.findByPk(id);
  }

  async getRentsByUser(userId: string) {
    return await Rent.findAll({ where: { ownerId: userId } });
  }

  async updateRent(
    id: string,
    data: Partial<Rent> & { schedules?: { startDate: string; endDate: string }[] }
  ) {
    const rent = await Rent.findByPk(id);
    if (!rent) return null;
  
    return await Rent.sequelize!.transaction(async (transaction) => {
      // Atualiza os dados da locação
      await rent.update(data, { transaction });
  
      // Se houver horários na atualização, precisamos atualizar RentSchedule
      if (data.schedules) {
        // Remove os horários antigos
        await RentSchedule.destroy({
          where: { rentId: id },
          transaction,
        });
  
        // Cria os novos horários
        const schedules = data.schedules.map((schedule) => ({
          rentId: id,
          startDate: new Date(schedule.startDate),
          endDate: new Date(schedule.endDate),
        }));
  
        await RentSchedule.bulkCreate(schedules, { transaction });
      }
  
      return rent;
    });
  }

  async deleteRent(id: string) {
    return await Rent.destroy({ where: { id } });
  }
}
