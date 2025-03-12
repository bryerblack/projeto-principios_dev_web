import { PlaceRepository } from "../repositories/PlaceRepository";
import { EquipmentRepository } from "../repositories/EquipmentRepository";

const placeRepository = new PlaceRepository();
const equipmentRepository = new EquipmentRepository();

export class PlaceService {
  async createPlace(data: {
    name: string;
    address: object;
    description?: string;
    pricePerHour: number;
    availability: string[];
    ownerId: string;
  }) {
    return await placeRepository.createPlace(data);
  }

  async getAllPlaces() {
    return await placeRepository.getAllPlaces();
  }

  async getPlaceById(id: string) {
    return await placeRepository.getPlaceById(id);
  }

  async getPlacesByOwner(ownerId: string) {
    return await placeRepository.getPlacesByOwner(ownerId);
  }
  

  async updatePlace(
    id: string,
    data: Partial<{
      name: string;
      address: object;
      description?: string;
      pricePerHour: number;
      availability: string[];
      ownerId: string;
    }>
  ) {
    return await placeRepository.updatePlace(id, data);
  }

  async deletePlace(id: string) {
    return await placeRepository.deletePlace(id);
  }

  async addEquipmentToPlace(
    place_id: string,
    data: {
      name: string;
      description?: string;
      pricePerHour: number;
      quantityAvailable: number;
    }
  ) {
    return await equipmentRepository.createEquipment({ ...data, place_id });
  }

  async removeEquipmentFromPlace(place_id: string, equipmentId: string) {
    const equipment = await equipmentRepository.getEquipmentById(equipmentId);
    if (equipment?.place_id === place_id) {
      return await equipmentRepository.deleteEquipment(equipmentId);
    }
  }
}
export const placeService = new PlaceService();