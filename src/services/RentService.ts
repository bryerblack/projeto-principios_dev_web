import { RentRepository } from "../repositories/RentRepository";
import { PlaceRepository } from "../repositories/PlaceRepository";
import { Transaction } from "sequelize";
import Rent from "../models/Rent";
import { HttpError } from "../errors/HttpError";
import { Status, Turn } from "../enums/turn.enum";
import sequelize from "../config/database";

const rentRepository = new RentRepository();
const placeRepository = new PlaceRepository();

export class RentService {
  async createRent(data: {
    placeId: string;
    ownerId: string;
    renterId: string;
    totalValue: number;
    status: string;
    paymentMethod: string;
    schedules: { day: string; turns: Turn[] }[];
  }) {
    return await sequelize.transaction(async (transaction: Transaction) => {
      return await rentRepository.createRent(
        {
          placeId: data.placeId,
          ownerId: data.ownerId,
          renterId: data.renterId,
          totalValue: data.totalValue,
          status: data.status,
          paymentMethod: data.paymentMethod,
          schedules: data.schedules,
        },
        transaction
      );
    });
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

  async updateRent(id: string, data: Partial<Rent>) {
    const rent = await rentRepository.getRentById(id);
    if (!rent) {
      throw new HttpError("Locação não encontrada.", 404);
    }

    return await rentRepository.updateRent(id, data);
  }

  async deleteRent(id: string) {
    const rent = await rentRepository.getRentById(id);
    if (!rent) {
      throw new HttpError("Locação não encontrada.", 404);
    }

    return await rentRepository.deleteRent(id);
  }

  async approveOrRejectRent(rentId: string, ownerId: string, status: Status) {
    if (!["confirmado", "rejeitado"].includes(status)) {
      throw new HttpError(
        "Status inválido. Use 'approved' ou 'rejected'.",
        406
      );
    }

    const rent = await rentRepository.getRentById(rentId);

    if (!rent) {
      throw new HttpError("Locação não encontrada.", 404);
    }

    if (rent.ownerId !== ownerId) {
      throw new HttpError(
        "Você não tem permissão para cancelar esta locação.",
        403
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
      throw new HttpError("Locação não encontrada.", 404);
    }

    if (rent.renterId !== userId) {
      throw new HttpError(
        "Você não tem permissão para cancelar esta locação.",
        403
      );
    }

    if (rent.status !== "pendente") {
      throw new HttpError(
        "Somente locações pendentes podem ser canceladas.",
        409
      );
    }

    return await rentRepository.updateRentStatus(rentId, "cancelado");
  }
}
