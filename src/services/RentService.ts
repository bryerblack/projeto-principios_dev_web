import { RentRepository } from "../repositories/RentRepository";

const rentRepository = new RentRepository();

export class RentService {
  async createRent(data: {
    placeId: string;
    ownerId: string;
    renterId: string;
    totalValue: number;
    dateTimes: string[];
    status: string;
    paymentMethod: string;
  }) {
    return await rentRepository.createRent(data);
  }

  async getAllRents() {
    return await rentRepository.getAllRents();
  }

  async getRentById(id: string) {
    return await rentRepository.getRentById(id);
  }

  async updateRent(
    id: string,
    data: Partial<{
      placeId: string;
      ownerId: string;
      renterId: string;
      totalValue: number;
      dateTimes: string[];
      status: string;
      paymentMethod: string;
    }>
  ) {
    return await rentRepository.updateRent(id, data);
  }

  async deleteRent(id: string) {
    return await rentRepository.deleteRent(id);
  }
}
