import { RentRepository } from "../repositories/RentRepository";
import { PlaceRepository } from "../repositories/PlaceRepository";
import { Transaction } from "sequelize";
import { RentScheduleRepository } from "../repositories/RentScheduleRepository";
import Rent from "../models/Rent";

const rentRepository = new RentRepository();
const placeRepository = new PlaceRepository();
const rentScheduleRepository = new RentScheduleRepository();

export class RentService {
  async createRent(data: {
    placeId: string;
    ownerId: string;
    renterId: string;
    totalValue: number;
    status: string;
    paymentMethod: string;
    schedules: { startDate: string; endDate: string }[]; // Novo formato
  }) {
    return await RentRepository.sequelize!.transaction(
      async (transaction: Transaction) => {
        return await rentRepository.createRent(
          {
            placeId: data.placeId,
            ownerId: data.ownerId,
            renterId: data.renterId,
            totalValue: data.totalValue,
            status: data.status,
            paymentMethod: data.paymentMethod,
            schedules: data.schedules, // Passando os horários para o repositório
          },
          transaction
        );
      }
    );
  }

  async getAllRents() {
    return await rentRepository.getAllRents();
  }

  async getRentById(id: string) {
    return await rentRepository.getRentById(id);
  }

  async getRentsByUserId(userId: string) {
    return await rentRepository.getRentsByUser(userId);
  }

  async updateRent(
    id: string,
    data: Partial<Rent> & {
      schedules?: { startDate: string; endDate: string }[];
    }
  ) {
    // Buscar a locação no banco
    const rent = await rentRepository.getRentById(id);
    if (!rent) {
      throw new Error("Locação não encontrada.");
    }

    // Atualiza os dados da locação
    const updatedRent = await rentRepository.updateRent(id, data);

    // Se houver atualização dos horários, precisamos atualizar RentSchedule
    if (data.schedules) {
      // Remove os horários antigos
      await rentScheduleRepository.deleteSchedulesByRentId(id);

      // Adiciona os novos horários
      const schedules = data.schedules.map((schedule) => ({
        rentId: id,
        startDate: new Date(schedule.startDate),
        endDate: new Date(schedule.endDate),
      }));

      await rentScheduleRepository.createSchedules(schedules);
    }

    return updatedRent;
  }

  async deleteRent(id: string) {
    const rent = await rentRepository.getRentById(id);
    if (!rent) {
      throw new Error("Locação não encontrada.");
    }

    return await rentRepository.deleteRent(id);
  }

  async approveOrRejectRent(rentId: string, ownerId: string, status: string) {
    if (!["approved", "rejected"].includes(status)) {
      throw new Error("Status inválido. Use 'approved' ou 'rejected'.");
    }

    const rent = await rentRepository.getRentById(rentId);

    if (!rent) {
      throw new Error("Locação não encontrada.");
    }

    if (rent.ownerId !== ownerId) {
      throw new Error(
        "Você não tem permissão para aprovar ou rejeitar esta locação."
      );
    }

    return await rentRepository.updateRent(rentId, { status });
  }

  async userHasPlace(userId: string): Promise<boolean> {
    const places = await placeRepository.getPlacesByOwner(userId);
    return places.length > 0;
  }

  async cancelRent(rentId: string, userId: string) {
    const rent = await rentRepository.getRentById(rentId);
    if (!rent) {
      throw new Error("Locação não encontrada.");
    }

    if (rent.renterId !== userId) {
      throw new Error("Você não tem permissão para cancelar esta locação.");
    }

    if (rent.status !== "pending") {
      throw new Error("Somente locações pendentes podem ser canceladas.");
    }

    return await rentRepository.deleteRent(rentId);
  }
}
